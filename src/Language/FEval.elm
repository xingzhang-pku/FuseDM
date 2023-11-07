module Language.FEval exposing (..)

import Utils exposing (..)
import Language.Utils exposing (..)
import Language.Syntax exposing (..)

feval : Env -> Exp -> Value
feval env exp =
    case exp of
        ETrue _     -> VTrue
        EFalse _    -> VFalse
        EFloat _  f -> VFloat  f
        EChar _   c -> VChar   c
        EString _ s -> VString s
        
        EVar _ x ->
            case lookup x env of
                Just (v, _) ->
                    case v of
                        VFix env_ e -> EFix [] e |> feval env_
                        _           -> v
                
                Nothing ->
                    VError ("Unbound variable: " ++ x)

        ELam _ p e   -> VClosure env p e
        EApp _ e1 e2 ->
            case feval env e1 of
                VClosure envf p ef ->

                    case e2 of
                        EFix _ e ->
                            case p of
                                PVar _ s -> feval ((s, (VFix env e, DFix env e))::envf) ef
                                _        -> VError "Error 46"

                        _ ->
                            case feval env e2 |> match p of
                                Just envm -> feval (envm ++ envf) ef
                                Nothing   -> VError "Error 10"

                _ -> VError "Error 11"
        
        EFix _ e -> EApp [] e (EFix [] e) |> feval env
        
        ECase _ e bs ->
            let
                v =
                    feval env e
                
                res =
                    matchBranch v bs 0
            in
                case res.ei of
                    EError _ ->
                        VError "Error 12"
                    
                    _ ->
                        feval (res.envm ++ env) res.ei

        ENil _     -> VNil
        EEmpList _ -> VNil
        
        ECons _   e1 e2 -> VCons  (feval env e1) (feval env e2)
        EList _   e1 e2 -> VCons  (feval env e1) (feval env e2)
        ETuple _ e1 e2  -> VTuple (feval env e1) (feval env e2)

        EParens _ e ->
            feval env e
        
        EError info ->
            VError ("Error 13: " ++ info)

        EBPrim _ bop e1 e2 ->
            case (feval env e1, feval env e2) of
                (VFloat f1, VFloat f2) ->
                    case bop of
                        Add -> VFloat (f1 + f2)
                        Mul -> VFloat (f1 * f2)
                        Sub -> VFloat (f1 - f2)
                        Div -> VFloat (f1 / f2)
                        Mod -> modBy (f2 |> round) (f1 |> round) 
                                    |> toFloat 
                                    |> VFloat
                        
                        Lt -> if f1 < f2  then VTrue else VFalse
                        Gt -> if f1 > f2  then VTrue else VFalse
                        Le -> if f1 <= f2 then VTrue else VFalse
                        Ge -> if f1 >= f2 then VTrue else VFalse
                        Eq -> if f1 == f2 then VTrue else VFalse
                        _   -> VError "49"

                (VString s1, VString s2) ->
                    if bop == Cat 
                    then VString (s1 ++ s2)
                    else VError "50"
                
                (v1, v2) ->
                    case bop of
                        Eq -> if v1 == v2 then VTrue else VFalse
                        
                        And ->
                            case (v1, v2) of
                                (VTrue, VTrue)   -> VTrue
                                (VTrue, VFalse)  -> VFalse
                                (VFalse, VTrue)  -> VFalse
                                (VFalse, VFalse) -> VFalse
                                _                -> VError "Error 47"
                        
                        Or ->
                            case (v1, v2) of
                                (VTrue,  VTrue)  -> VTrue
                                (VTrue,  VFalse) -> VTrue
                                (VFalse, VTrue)  -> VTrue
                                (VFalse, VFalse) -> VFalse
                                _                -> VError "Error 48"
                        
                        _ ->
                            VError "TODO"
        
        EUPrim _ uop e ->
            case uop of
                Neg ->
                    case feval env e of
                        VFloat f -> VFloat (-f)
                        _        -> VError "Error 14"

                Not ->
                    case feval env e of
                        VTrue  -> VFalse
                        VFalse -> VTrue
                        _      -> VError "Error 15"
        
        EGraphic _ s e -> VGraphic s (feval env e)

        EMap _ e1 e2 ->
            case (feval env e1, feval env e2) of
                (VClosure envf p ef, VGraphic s pars) ->
                    case match p pars of
                        Just envm -> feval (envm ++ envf) ef |> VGraphic s
                        Nothing   -> VError "Error 52"
                
                _ -> VError "Error 55"

        EUnwrap _ e ->
            case feval env e of
                VGraphic _ v -> v
                
                _ -> VError "Error 56"