module Language.Utils exposing (..)

import Utils exposing (..)
import Language.Syntax exposing (..)
import Language.UtilsFD exposing (eqDelta)

match : Pattern -> Value -> Maybe (List (String, (Value, Delta)))
match p v =
    case (p, v) of
        (PVar _ s, _) -> Just [(s, (v, value2DId v))]
        
        (PNil _,     VNil) -> Just []
        (PEmpList _, VNil) -> Just []
        (PTrue _,  VTrue)  -> Just []
        (PFalse _, VFalse) -> Just []

        (PCons _ p1 p2, VCons v1 v2) ->
            case (match p1 v1, match p2 v2) of
                (Just m1, Just m2) -> Just (m1 ++ m2)
                _                  -> Nothing
        
        (PList _ p1 p2, VCons v1 v2) ->
            case (match p1 v1, match p2 v2) of
                (Just m1, Just m2) -> Just (m1 ++ m2)
                _                  -> Nothing
        
        (PTuple _ p1 p2, VTuple v1 v2) ->
            case (match p1 v1, match p2 v2) of
                (Just m1, Just m2) -> Just (m1 ++ m2)
                _                  -> Nothing
        
        (PFloat _  f, VFloat g)  -> if f  == g  then Just [] else Nothing
        (PString _ s, VString t) -> if s  == t  then Just [] else Nothing
        (PChar _  c1, VChar c2)  -> if c1 == c2 then Just [] else Nothing
        
        _ -> Nothing


value2DId : Value -> Delta
value2DId v =
    case v of
        VFix env1 e1        -> DFix env1 e1
        VClosure env1 p1 e1 -> DClosure env1 p1 e1
        VCons v1 v2         -> DCons   (value2DId v1) (value2DId v2)
        VTuple v1 v2        -> DTuple (value2DId v1) (value2DId v2)
        _                   -> DId


type alias MatchCaseRes =
    { envm : Env
    , choice: Int
    , ei : Exp
    , pi : Pattern
    }


matchBranch : Value -> Branch -> Int -> MatchCaseRes
matchBranch v b cnt =
    case b of
        BSin _ p e ->
            case match p v of
                Nothing ->
                    { envm = []
                    , choice = cnt + 1
                    , ei = EError "match error"
                    , pi = p
                    }
                
                Just envm ->
                    { envm = envm
                    , choice = cnt + 1
                    , ei = e
                    , pi = p
                    }

        BCom _ b1 b2 ->
            let
                res = matchBranch v b1 cnt
            in
                case res.ei of
                    EError _ ->
                        matchBranch v b2 res.choice
                    
                    _ ->
                        res


updateBranch : Branch -> Int -> Int -> Exp -> (Branch, Int)
updateBranch b cnt choice new_ei =
    case b of
        BSin ws p e ->
            if cnt + 1 == choice then
                (BSin ws p new_ei, cnt + 1)
            else
                (BSin ws p e, cnt + 1)
        
        BCom ws b1 b2 ->
            let
                (new_b1, cnt1) = 
                    updateBranch b1 cnt choice new_ei
                
                (new_b2, cnt2) =
                    updateBranch b2 cnt1 choice new_ei
            in
                (BCom ws new_b1 new_b2, cnt2)


updateDelta : Env -> String -> Delta -> Env
updateDelta env s d =
    case env of
        [] ->
            []
        
        (s1, (v1, d1)) :: env1 ->
            if s == s1 then
                (s1, (v1, d))  :: env1
            else
                (s1, (v1, d1)) :: updateDelta env1 s d


substDelta : Pattern -> Env -> Delta
substDelta p env =
    case p of
        PVar _ s ->
            case lookup s env of
                Nothing     -> DError "substDelta: not found"
                Just (_, d) -> d
        
        PCons _ p1 p2 ->
            DCons (substDelta p1 env) (substDelta p2 env)
        
        PList _ p1 p2 ->
            DCons (substDelta p1 env) (substDelta p2 env)
        
        PTuple _ p1 p2 ->
            DTuple (substDelta p1 env) (substDelta p2 env)

        _ ->
            DId


freeVars : Exp -> List String
freeVars exp =
    case exp of
        EVar _ s -> [s]

        ELam _ p e ->
            freeVars e |> List.filter (\s -> List.member s (varsInPattern p) |> not)
        
        EApp _ e1 e2  -> freeVars e1 ++ freeVars e2   
        
        ECase _ e bs -> freeVars e ++ varsInBranch bs
        
        EBPrim _ _ e1 e2   -> freeVars e1 ++ freeVars e2
        ECons _ e1 e2      -> freeVars e1 ++ freeVars e2     
        EList _ e1 e2      -> freeVars e1 ++ freeVars e2
        ETuple _ e1 e2     -> freeVars e1 ++ freeVars e2 
        
        EUPrim _ _ e -> freeVars e
        EParens _  e -> freeVars e
        EFix _     e -> freeVars e

        EGraphic _ _ e -> freeVars e
        EMap _ _ e     -> freeVars e
        EUnwrap _ e    -> freeVars e

        _ -> []


varsInPattern : Pattern -> List String
varsInPattern pattern =
    case pattern of
        PVar _ s -> [s]
        
        PCons _  p1 p2 -> varsInPattern p1 ++ varsInPattern p2    
        PList _  p1 p2 -> varsInPattern p1 ++ varsInPattern p2
        PTuple _ p1 p2 -> varsInPattern p1 ++ varsInPattern p2
        
        _ ->
            []


varsInBranch : Branch -> List String
varsInBranch branch =
    case branch of
        BSin _ p e ->
            freeVars e 
            |> List.filter (\s -> List.member s (varsInPattern p) |> not)
        
        BCom _ b1 b2 ->
            varsInBranch b1 ++ varsInBranch b2


two_wayMerge : List String -> List String -> Env -> Env -> (Env, List (String, Delta), List (String, Delta))
two_wayMerge fv1 fv2 env1 env2 =
    case (env1, env2) of
        ((s1, (v1, d1)) :: env1_, (s2, (_, d2)) :: env2_) ->
            if s1 == s2 then
                    let
                        (env, denv1, denv2) =
                            two_wayMerge fv1 fv2 env1_ env2_
                    in
                    if String.startsWith "*" s1 then
                        -- Special Variables
                        if eqDelta d1 DId |> not then
                            ((s1, (v1, d1))::env, denv1, denv2)
                        else
                            ((s1, (v1, d2))::env, denv1, denv2)
                    else
                        -- Ordinary Variables
                        if (eqDelta d1 d2) || (List.member s1 fv2 |> not) then
                                (((s1, (v1, d1))::env), denv1, denv2)
                        
                        else if List.member s1 fv1 |> not then
                                (((s1, (v1, d2))::env), denv1, denv2)
                                
                        else ((s1, (v1, DId))::env, (s1, d1)::denv1, (s2,d2)::denv2)
            
            else ([("Two-way Merge Error", (VError "", DError ""))], [], [])

        ([], []) -> ([], [], [])
        _        -> ([("Two-way Merge Error", (VError "", DError ""))], [], [])