module Printer.Pattern exposing (..)

import Debug exposing (toString)
import Language.Syntax exposing (Pattern(..))

printPattern : Pattern -> String
printPattern p =
    case p of
        PVar [spc] s ->
            s ++ spc

        PCons ws p1 p2 ->
            case ws of
                [spc] ->
                    (printPattern p1) ++ "::" ++ spc ++ (printPattern p2)

                _ ->
                    "Error 27"

        PNil [spc] ->
            "nil" ++ spc

        PList ws p1 p2 ->
            case ws of
                [spc1, spc2] ->
                    "[" ++ spc1 ++ (printPattern p1) ++ 
                    (printPattern p2) ++ "]" ++ spc2
                
                [spc] ->
                    "," ++ spc ++ (printPattern p1) ++ (printPattern p2)

                _ ->
                    "Error 28"

        PEmpList [spc1, spc2] ->
            "[" ++ spc1 ++ "]" ++ spc2
        
        PEmpList [] ->
            ""

        PFloat [spc] n ->
            (toString n) ++ spc

        PTrue [spc] ->
            "true" ++ spc

        PFalse [spc] ->
            "false" ++ spc

        PChar [spc] c ->
            "\'" ++ (String.fromChar c) ++ "\'" ++ spc

        PString [spc] s ->
            "\"" ++ s ++ "\"" ++ spc

        PTuple [spc1, spc2, spc3] t1 t2 ->
            "(" ++ spc1 ++ (printPattern t1) ++ 
            "," ++ spc2 ++ (printPattern t2) ++ 
            ")" ++ spc3

        _ ->
            "Error 29" ++ (toString p)