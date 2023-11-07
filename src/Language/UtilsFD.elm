module Language.UtilsFD exposing (..)

import Language.Syntax exposing (..)

type alias MatchDCaseRes =
    { ctx : Ctx
    , choice: Int
    , di : Maybe Delta
    , pi : Pattern
    }


dmatch : Pattern -> Param -> Maybe Ctx
dmatch p param =
    case (p, param) of
        (PVar _ s, _)      -> Just [(s, param)]
        
        (PNil _,    ANil)  -> Just []
        (PEmpList _,ANil)  -> Just []
        (PTrue _,  ATrue)  -> Just []
        (PFalse _, AFalse) -> Just []

        (PFloat _ f1, AFloat f2) -> 
            if f1 == f2 then Just [] else Nothing
        
        (PCons _ p1 p2, ACons a1 a2) ->
            case (dmatch p1 a1, dmatch p2 a2) of
                (Just ctx1, Just ctx2) -> Just (ctx1 ++ ctx2)
                _                      -> Nothing

        (PList _ p1 p2, ACons a1 a2) ->
            case (dmatch p1 a1, dmatch p2 a2) of
                (Just ctx1, Just ctx2) -> Just (ctx1 ++ ctx2)
                _                      -> Nothing
        
        (PTuple _ p1 p2, ATuple a1 a2) ->
            case (dmatch p1 a1, dmatch p2 a2) of
                (Just ctx1, Just ctx2) -> Just (ctx1 ++ ctx2)
                _                      -> Nothing
        
        _ ->
            Nothing


param2Exp : Param -> Exp
param2Exp param =
    case param of
        ANil             -> ENil   [""]
        ATrue            -> ETrue  [""]
        AFalse           -> EFalse [""]
        AVar s           -> EVar   [""] s
        AFloat f         -> EFloat [""] f

        AAdd a1 a2       -> EBPrim [""] Add (param2Exp a1) (param2Exp a2)
        ASub a1 a2       -> EBPrim [""] Sub (param2Exp a1) (param2Exp a2)
        AMul a1 a2       -> EBPrim [""] Mul (param2Exp a1) (param2Exp a2)
        ADiv a1 a2       -> EBPrim [""] Div (param2Exp a1) (param2Exp a2)
        ALt  a1 a2       -> EBPrim [""] Lt  (param2Exp a1) (param2Exp a2)
        ALe  a1 a2       -> EBPrim [""] Le  (param2Exp a1) (param2Exp a2)
        AEq  a1 a2       -> EBPrim [""] Eq  (param2Exp a1) (param2Exp a2)

        ACons a1 a2      -> ECons  [""]             (param2Exp a1) (param2Exp a2)
        ATuple a1 a2     -> ETuple ["","",""]     (param2Exp a1) (param2Exp a2)

        AGraphic s a     -> EGraphic [" "] s (param2EList a)
        
        AParens a        -> EParens ["",""] (param2Exp a)
        AError info      -> EError info


param2EList : Param -> Exp
param2EList param =
    case param of
        ANil        -> EEmpList []
        ACons a1 a2 -> EList [" ", ""] (param2Exp a1) (param2EList a2)
        _           -> EError "Error 06"


value2Param : Value -> Param
value2Param value =
    case value of
        VNil        -> ANil
        VFloat f    -> AFloat f

        VCons v1 v2  -> ACons   (value2Param v1) (value2Param v2)
        VTuple v1 v2 -> ATuple (value2Param v1) (value2Param v2)

        VError info  -> AError info
        _            -> AError "Error in value2Param"


mergeST : ST -> ST -> ST
mergeST st1 st2 =
    case (st1, st2) of
        ((s1, (env1, e1))::st1_, (_, (_, EError _))::st2_) ->
            (s1, (env1, e1))::mergeST st1_ st2_

        ((s1, (env1, EError _))::st1_, (_, (_, e2))::st2_) ->
            (s1, (env1, e2))::mergeST st1_ st2_
        
        ([], []) -> []
        _        -> []


updateST : ST -> String -> Exp -> ST
updateST st s e =
    case st of
        [] ->
            []
        
        (s1, (env1, e1)) :: st_ ->
            if s == s1 then
                (s1, (env1, e))  :: st_
            else
                (s1, (env1, e1)) :: updateST st_ s e


eqDelta : Delta -> Delta -> Bool
eqDelta d1 d2 =
    if d1 == d2 then
        True
    
    else if d1 == DId && d2 == DAdd (AFloat 0) then True
    else if d1 == DId && d2 == DMul (AFloat 1) then True
    else if d1 == DAdd (AFloat 0) && d2 == DId then True
    else if d1 == DMul (AFloat 1) && d2 == DId then True

    else if d1 == DId && isEveryDId d2 then True
    else if d2 == DId && isEveryDId d1 then True

    else case (d1, d2) of
        (DCom d11 d12, DCom d21 d22)     -> eqDelta d11 d21 && eqDelta d12 d22

        (DCons d11 d12, DCons d21 d22)   -> eqDelta d11 d21 && eqDelta d12 d22
        (DTuple d11 d12, DTuple d21 d22) -> eqDelta d11 d21 && eqDelta d12 d22

        (DCtt p1 del1, DCtt p2 del2)       -> eqDelta del1 del2 && p1 == p2
        (DGen e1 del1 p1, DGen e2 del2 p2) -> eqDelta del1 del2 && p1 == p2 && e1 == e2
        
        _ -> False


isEveryDId : Delta -> Bool
isEveryDId delta =
    case delta of
        DId          -> True
        DCom   d1 d2 -> isEveryDId d1 && isEveryDId d2
        DCons  d1 d2 -> isEveryDId d1 && isEveryDId d2
        DTuple d1 d2 -> isEveryDId d1 && isEveryDId d2
        _            -> False


fixCheck : Value-> Delta -> Maybe Delta
fixCheck v d =
    case (v, d) of
        (VFix _ _, DClosure ((_, (_, DFix _ (ELam ws1 p1 (ELam ws2 p2 e1)))) :: env2) _ e2) ->
            if e1 == e2 then
                Just (DFix env2 (ELam ws1 p1 (ELam ws2 p2 e2)))
            else
                Nothing

        _ -> Just d