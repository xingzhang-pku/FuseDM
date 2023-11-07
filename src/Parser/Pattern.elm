module Parser.Pattern exposing (..)

import Parser exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import Parser.Utils exposing (..)
import Parser.WhiteSpace exposing (..)
import Language.Syntax exposing (..)


pattern : Parser Pattern
pattern = buildExpressionParser pConsOp (lazy (\_ -> pterm))


pConsOp : OperatorTable Pattern
pConsOp = [[Infix (succeed (\spc -> PCons [spc])
                        |. symbol "::"
                        |= mspaces)
            AssocRight]]


pterm : Parser Pattern
pterm =
    oneOf
    [ pvar
    , pnil
    , backtrackable pempList
    , pList
    , backtrackable pfloat
    , ptrue
    , pfalse
    , backtrackable ptuple
    , pstring
    , pchar
    ]


-- PVar
pvar : Parser Pattern
pvar =
    oneOf 
    [ succeed (\vn spc -> PVar [spc] vn)
        |= varName
        |= mspaces
    , succeed (\vn spc -> PVar [spc] ("*" ++ vn))
        |. symbol "*"
        |= varName
        |= mspaces
    ]
    


-- PCons
pList : Parser Pattern
pList =
    succeed (\spc1 p ps spc2 -> PList [spc1, spc2] p ps)
        |. symbol "["
        |= mspaces
        |= lazy (\_ -> pattern)
        |= pListloop
        |. symbol "]"
        |= mspaces


pListloop : Parser Pattern
pListloop =
    loop [] pListHelper |> (map ptermListToPList)


pListHelper : List (Pattern, WS) -> 
            Parser (Step (List (Pattern, WS)) (List (Pattern, WS)))
pListHelper revPats =
    oneOf
    [ succeed (\spc p -> Loop ((p, [spc]) :: revPats))
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pattern)
    , succeed ()
        |> map (\_ -> Done (List.reverse revPats))
    ]


ptermListToPList: List (Pattern,WS) -> Pattern
ptermListToPList ls =
    case ls of
        [] ->
            PEmpList []
        (p, ws) :: ps ->
            PList ws p (ptermListToPList ps)


-- PEmpList
pempList : Parser Pattern
pempList =
    succeed (\spc1 spc2 -> PEmpList [spc1, spc2])
        |. symbol "["
        |= mspaces
        |. symbol "]"
        |= mspaces


-- PNil
pnil : Parser Pattern
pnil =
    succeed (\spc -> PNil [spc])
        |. keyword "nil"
        |= mspaces


-- PFloat
pfloat : Parser Pattern
pfloat =
    oneOf
        [ succeed (\n spc -> PFloat [spc] n)
            |= number
                { int = Just toFloat
                , hex = Nothing 
                , octal = Nothing
                , binary = Nothing 
                , float = Just identity
                }
            |= mspaces
        , succeed (\n spc -> PFloat [spc] (negate n))
            |. symbol "-"
            |= float
            |= mspaces
        ]


-- PTrue
ptrue : Parser Pattern
ptrue =
    succeed (\spc -> PTrue [spc])
        |. keyword "true"
        |= mspaces


-- PFalse
pfalse : Parser Pattern
pfalse =
    succeed (\spc -> PFalse [spc])
        |. keyword "false"
        |= mspaces


-- PChar
pchar : Parser Pattern
pchar =
    succeed (\c spc -> PChar [spc] c)
        |. symbol "\'"
        |= mchar
        |. symbol "\'"
        |= mspaces


-- PString
pstring : Parser Pattern
pstring =
    succeed (\s spc -> s
                    |> PString [spc])
        |. symbol "\""
        |= mstring
        |. symbol "\""
        |= mspaces


-- PTuple 
ptuple : Parser Pattern
ptuple =
    succeed (\spc1 p1 spc2 p2 spc3 -> PTuple [spc1, spc2, spc3] p1 p2)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> pattern)
        |. symbol ")"
        |= mspaces