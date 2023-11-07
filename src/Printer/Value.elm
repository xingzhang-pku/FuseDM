module Printer.Value exposing (..)

import Printer.Exp as Exp
import Debug exposing (toString)
import Language.Syntax exposing (..)
import Printer.Pattern exposing (printPattern)


printGraphics : Value -> String
printGraphics value =
    case value of
        VCons v1 v2 -> print v1 ++ printGraphics v2
        VNil        -> ""
        _           -> "Error 49"


print : Value -> String
print v  =
    case v of
        VNil        -> "[]"
        VFloat n    -> toString n
        VTrue       -> "true"
        VFalse      -> "false"
        VString s   -> "\"" ++ s ++ "\""
        VChar c     -> "\'"++(String.fromChar c)++"\'"
        VCons v1 v2 -> "[" ++ (printList v1 v2) ++ "]"

        VClosure env p e ->
            "<<< " ++ printEnv env ++ ", " ++
            "λ " ++ printPattern p ++ ". " ++ Exp.print e ++ " >>> "
        VFix env e ->
            "fix " ++ printEnv env ++ Exp.print e
        
        VTuple v1 v2 ->
            "( "++(print v1)++", "++(print v2)++" )"
        
        VError info    -> info

        VGraphic _ _   -> printGraphic v


printGraphic : Value -> String
printGraphic value =
    case value of
        VGraphic "rect" (VCons rd (VCons color (VCons x (VCons y (VCons w (VCons h VNil)))))) ->
            "<rect "++ printFill color  ++ 
            " x=\"" ++ print x ++ "\" y=\"" ++ print y ++
            "\" width=\"" ++ print w ++ "\" height=\"" ++ print h ++
            "\" transform=\"rotate(" ++ print rd ++ ")\"></rect>"
        
        VGraphic "circle" (VCons rd (VCons color (VCons x (VCons y (VCons r VNil))))) ->
            "<circle "++ printFill color  ++
            " cx=\"" ++ print x ++ "\" cy=\"" ++ print y ++ "\" r=\"" ++ print r ++
            "\" transform=\"rotate(" ++ print rd ++ ")\"></circle>"
        
        VGraphic "ellipse" (VCons rd (VCons color (VCons x (VCons y (VCons rx (VCons ry VNil)))))) ->
            "<ellipse "++ printFill color  ++ 
            " cx=\"" ++ print x ++ "\" cy=\"" ++ print y ++
            "\" rx=\"" ++ print rx ++ "\" ry=\"" ++ print ry ++
            "\" transform=\"rotate(" ++ print rd ++ ")\"></ellipse>"
        
        VGraphic "line" (VCons rd (VCons color (VCons x1 (VCons y1 (VCons x2 (VCons y2 VNil)))))) ->
            "<line "++ printStroke color  ++ " x1=\"" ++ print x1 ++ "\" y1=\"" ++ print y1 ++
            "\" x2=\"" ++ print x2 ++ "\" y2=\"" ++ print y2 ++ "\" stroke-width=\"3\" " ++
            "transform=\"rotate(" ++ print rd ++ ")\"></line>"

        VGraphic "polygon" (VCons rd (VCons color (VCons points VNil))) ->
            "<polygon "++ printFill color  ++ " points=\"" ++ printPoints points ++ 
            "\" transform=\"rotate("++ print rd ++ ")\"></polygon>"
        
        VGraphic "g" (VCons ra (VCons childs VNil)) ->
            "<g transform=\"rotate("++ print ra ++ ")\">" ++ printGraphics childs ++ "</g>"

        _ ->
            let _ = Debug.log "value" value in
            "Error 39"


printPoints : Value -> String
printPoints points =
    case points of
        VNil ->
            ""

        VCons (VTuple x y) ps ->
            print x ++ "," ++ print y ++ " " ++ printPoints ps

        _ ->
            "Error 07"


printFill : Value -> String
printFill color =
    "fill=\"hsl(" ++ print color ++", 100%, 50%)\""


printStroke : Value -> String
printStroke color =
    "stroke=\"hsl(" ++ print color ++", 100%, 50%)\""


printList : Value -> Value -> String
printList v vs =
    case vs of
        VNil->
            print v

        VCons v1 v2 -> 
            (print v)++", "++(printList v1 v2)

        _ ->
            "Error 08"


printString : Value-> String
printString t =
    case t of
        VString s ->
            s

        _ ->
            "Error 09"


printST : ST -> String
printST st =
    case st of
        [] -> ""
        (s, (_, e))::st_ ->
            s ++ "|->" ++ Exp.print e ++ printST st_

    
printEnv : Env -> String
printEnv env =
    "{ " ++ (List.take (List.length env - 7) env |> printEnv_) ++ "}"


printDEnv : List (String, Delta) -> String
printDEnv denv =
    case denv of
        [] -> ""

        (s, d) :: denv_ ->
            s ++ " |-> " ++ printDelta d ++ "\n" ++ printDEnv denv_


printEnv_ : Env -> String
printEnv_ env =
    case env of
        [] ->
            ""

        (s, (v, d)) :: env_ ->
            s ++ " |-> " ++ print v ++ "\n" ++ 
            "Delta: "  ++ printDelta d  ++ "\n\n" ++ 
            printEnv_ env_


printDelta : Delta -> String
printDelta delta =
    case delta of
        DId  -> "id "
        
        DAdd p ->
            "+ " ++ printParam p ++ " "
        
        DMul p ->
            "* " ++ printParam p ++ " "
        
        DFix env e ->
            "fix " ++ printEnv env ++ " " ++ Exp.print e
        
        DClosure env p e ->
            "( " ++ printEnv env ++ ", " ++
            "λ " ++ printPattern p ++ 
            ". " ++ Exp.print e ++ " ) "
        
        DCons d1 d2 ->
            printDelta d1 ++ " :: " ++ printDelta d2
        
        DInsert n p ->
            "insert " ++ toString n ++ " " ++ printParam p

        DModify n d ->
            "modify " ++ toString n ++ " " ++ printDelta d
        
        DDelete n ->
            "delete " ++ toString n

        DCopy n ->
            "copy " ++ toString n
        
        DTuple d1 d2 ->
            "("  ++ printDelta d1 ++ 
            ", " ++ printDelta d2 ++ ") "
        
        DFun p d ->
            "\\" ++ printPattern p ++ "->" ++ printDelta d
        
        DApp d p ->
            printParam p ++ "|>" ++ printDelta d
        
        DGen e d p ->
            "{"  ++ printDelta d ++ 
            "|"  ++ Exp.print e ++ 
            "<|" ++ printParam p ++ "}"
        
        DRewr p -> "rewr " ++ printParam p
        DAbst p -> "& "    ++ printParam p

        DCtt p d ->
            "? " ++ printPattern p ++ "=> " ++ printDelta d

        DCom d1 d2 ->
            printDelta d1 ++ " . " ++ printDelta d2

        DMem s ls ->
            "mem " ++ s ++ " " ++ (Debug.toString ls)
        
        DGroup s d ->
            "group " ++ s ++ " " ++ printDelta d
        
        DMap d ->
            "Graphic.map " ++ printDelta d

        DError info -> info


printParam : Param -> String
printParam param =
    case param of
        ANil             -> "nil"
        ATrue            -> "true"
        AFalse           -> "false"
        AVar s           -> s
        AFloat f         -> toString f
        
        AAdd p1 p2       -> printParam p1 ++ " + " ++ printParam p2
        ASub p1 p2       -> printParam p1 ++ " - " ++ printParam p2 
        AMul p1 p2       -> printParam p1 ++ " * " ++ printParam p2
        ADiv p1 p2       -> printParam p1 ++ " / " ++ printParam p2
        ALt  p1 p2       -> printParam p1 ++ " < " ++ printParam p2
        ALe  p1 p2       -> printParam p1 ++ " <= " ++ printParam p2
        AEq  p1 p2       -> printParam p1 ++ " == " ++ printParam p2
        ACons p1 p2      -> printParam p1 ++ " :: " ++ printParam p2

        ATuple p1 p2    -> "(" ++ printParam p1 ++ ", " ++ printParam p2 ++ ")"

        AGraphic s p     -> s ++ " " ++ printParam p

        AParens p        -> "(" ++ printParam p ++ ")"
        AError info      -> info