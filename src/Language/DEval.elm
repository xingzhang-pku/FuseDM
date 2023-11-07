module Language.DEval exposing (..)

import Utils exposing (lookup)
import Language.Syntax exposing (..)
import Language.UtilsFD exposing (..)

deval : Ctx -> Delta -> Delta
deval ctx delta =
    case delta of
        DId         -> delta
        DAdd p      -> DAdd (peval ctx p)
        DMul p      -> DMul (peval ctx p)

        DCons d1 d2  -> DCons   (deval ctx d1) (deval ctx d2)
        DTuple d1 d2 -> DTuple  (deval ctx d1) (deval ctx d2)

        DCopy _     -> delta
        DDelete _   -> delta
        DModify n d -> DModify n (deval ctx d)
        DInsert n p -> DInsert n (peval ctx p)
        
        DMap d      -> DMap (deval ctx d)
        
        DGen e d p  -> DGen e d (peval ctx p)

        DRewr p     -> case peval ctx p of
                        AError _ -> delta
                        pv       -> DRewr pv
        
        DAbst _     -> delta
        DCtt p d    -> DCtt p (deval ctx d)

        DMem _ _    -> delta
        DGroup _ _  -> delta

        DCom  d1 d2  -> DCom    (deval ctx d1) (deval ctx d2)        
        DApp (DFun p d) pr -> case dmatch p (peval ctx pr) of
                                Just ctxm -> deval (ctxm ++ ctx) d
                                Nothing   -> DError "Error 19"
        
        _ -> DError "Error 22"


peval : Ctx -> Param -> Param
peval  ctx param =
    case param of
        AVar s ->
            case lookup s ctx of
                Just p -> p
                Nothing -> AError "Error 40"
        
        AAdd p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> AFloat (f1 + f2)
                _                      -> AError "Error 41"
        
        ASub p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> AFloat (f1 - f2)
                _                      -> AError "Error 41 sub" 
        
        AMul p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> AFloat (f1 * f2)
                _                      -> AError "Error 42"
        
        ADiv p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> AFloat (f1 / f2)
                _                      -> AError "Error 42 div"

        ALt p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> if f1 < f2 then ATrue else AFalse
                _                      -> AError "Error 43"

        ALe p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> if f1 <= f2 then ATrue else AFalse
                _                      -> AError "Error 44"
        
        AEq p1 p2 ->
            case (peval ctx p1, peval ctx p2) of
                (AFloat f1, AFloat f2) -> if f1 == f2 then ATrue else AFalse
                _                      -> AError "Error 45"

        ACons   p1 p2 -> ACons  (peval ctx p1) (peval ctx p2)
        ATuple  p1 p2 -> ATuple (peval ctx p1) (peval ctx p2)
        
        AGraphic s p  -> AGraphic s (peval ctx p)

        AParens p -> peval ctx p
        _         -> param