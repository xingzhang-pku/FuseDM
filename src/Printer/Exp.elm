module Printer.Exp exposing (..)

import Debug exposing (toString)
import Language.Syntax exposing (..)
import Printer.Pattern exposing (printPattern)

print : Exp -> String
print exp =
    case exp of
        EFloat [spc] n ->
            (toString n) ++ spc

        ETrue [spc] ->
            "true" ++ spc

        EFalse [spc] ->
            "false" ++ spc

        EChar [spc] c ->
            "\'" ++ (String.fromChar c) ++ "\'" ++ spc

        EString [spc] s ->
            "\"" ++ s ++ "\"" ++ spc

        EVar ws s ->
            case ws of
                [] ->
                    if s == "main" then
                        ""
                    else
                        "Error 16"

                [spc] ->
                    s ++ spc
                
                _ ->
                    "Error 17"

        ELam [spc1, spc2] p e ->
            "\\" ++ spc1 ++ printPattern p ++ "->" ++ spc2 ++ print e

        ELam [] p e ->
            "\\" ++ printPattern p ++ "-> " ++ print e

        EApp ["LET", spc1, spc2, spc3] (ELam _ p e2) e1 ->
            "let" ++ spc1 ++ (printPattern p) ++ "=" ++ spc2 ++ print e1 ++ "in" ++ spc3 ++ print e2

        EApp ["LETREC", spc1, spc2, spc3] (ELam [] p e2) (EFix [] (ELam [] _ e1)) ->
            "letrec" ++ spc1 ++ printPattern p ++ "=" ++ spc2 ++ print e1 ++ "in" ++ spc3 ++ print e2

        EApp ["EQ", spc1, spc2, spc3] (ELam [] p e2) e1 ->
            let
                (paramList, tFunc) = splitFuncDef [] e1
            in
                printPattern p ++ spc1 ++ printParamList paramList ++ "=" ++ spc2 ++ print tFunc ++ ";" ++ spc3 ++ print e2

        EApp ["Rec", spc1, spc2, spc3] (ELam [] p e2) (EFix _ (ELam _ _ e1)) ->
            let
                (paramList, tFunc) = splitFuncDef [] e1
            in
                printPattern p ++ spc1 ++ printParamList paramList ++ ":=" ++ spc2 ++ print tFunc ++ ";" ++ spc3 ++ print e2
    
        EApp [] e1 e2 -> print e1 ++ print e2

        EFix _ e ->
            "fix " ++ print e

        ECase [spc1, spc2] e b ->
            "case" ++ spc1 ++ print e ++ "of" ++ spc2 ++ printBranch b
                
        ECons [spc] e1 e2 ->
            (print e1) ++ "::" ++ spc ++ print e2

        EList ws e1 e2 ->
            case ws of
                [spc1, spc2] ->
                    "[" ++ spc1 ++ print e1 ++ printList e2 ++ "]" ++ spc2

                [spc] ->
                    "[" ++ spc ++ print e1 ++ printList e2 ++ "]"

                _ ->
                    "Error 23"

        EEmpList ws ->
            case ws of
                [spc1, spc2] -> "[" ++ spc1 ++ "]" ++ spc2
                []           -> "[]"
                _            -> "Error 54"
            
        ENil [spc] ->
            "nil" ++ spc

        ETuple [spc1, spc2, spc3] e1 e2 ->
            "(" ++ spc1 ++ print e1 ++ "," ++ spc2 ++ print e2 ++ ")" ++ spc3

        EBPrim [spc] op e1 e2 ->
            let
                sop =
                    case op of
                        Add -> "+"
                        Sub -> "-"
                        Mul -> "*" 
                        Div -> "/"
                        Mod -> "%"
                        Eq  -> "=="
                        Lt  -> "<"
                        Gt  -> ">"
                        Le  -> "<="
                        Ge  -> ">="
                        And -> "&&"
                        Or  -> "||"
                        Cat -> "++"
            in
                print e1 ++ sop ++ spc ++ print e2

        EUPrim [spc] op e ->
            let
                sop =
                    case op of
                        Neg -> "-"
                        Not -> "~"
            in
                sop ++ spc ++ (print e)

        EParens [spc1, spc2] e ->
            "(" ++ spc1 ++ print e ++ ")" ++ spc2

        EGraphic [spc] s e -> s ++ spc ++ print e

        EMap [spc] e1 e2 -> "Graphic.map"    ++ spc ++ print e1 ++ print e2
        EUnwrap [spc] e  -> "Graphic.unwrap" ++ spc ++ print e

        _ -> 
            "Error 24" ++ toString exp


printBranch : Branch -> String
printBranch b =
    case b of
        BSin [spc] p e ->
            printPattern p ++ "->" ++ spc ++ print e

        BCom [spc] b1 b2 ->
            printBranch b1 ++ "|" ++ spc ++ printBranch b2

        _ ->
            "Error 25"


printList : Exp -> String
printList ls =
    case ls of
        EEmpList _ ->
            ""
        
        EList [spc] e1 e2 ->
            "," ++ spc ++ print e1 ++ printList e2
        
        EList _ e1 e2 ->
            ", " ++ print e1 ++ printList e2

        _ ->
            "Error 26"


printParamList : List Pattern -> String
printParamList pls =
    case pls of
        [] -> 
            ""

        p :: pls_ ->
            printPattern p ++ printParamList pls_


splitFuncDef : List Pattern -> Exp -> (List Pattern, Exp)
splitFuncDef params exp =
    case exp of
        ELam [] p e ->
            splitFuncDef (p :: params) e

        _ -> 
            (List.reverse params, exp)