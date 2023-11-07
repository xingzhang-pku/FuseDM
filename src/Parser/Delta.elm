module Parser.Delta exposing (..)

import Parser.Exp exposing (exp)
import Parser.Pattern exposing (pattern)
import Parser.Utils exposing (varName)
import Parser exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import Language.Syntax exposing (..)

parse : String -> Result (List DeadEnd) Delta
parse =
    run (delta |. end)

delta : Parser Delta
delta =
    buildExpressionParser operators (lazy <| \_ -> temp)

operators : OperatorTable Delta
operators =
    [ [Infix dcons AssocRight]
    , [Infix dcom  AssocRight]]


temp : Parser Delta
temp =
    oneOf
        [ did
        , dmap
        , dadd
        , dmul
        , list
        , backtrackable dparens
        , backtrackable dtuple
        , dfun
        , dapp
        , dgen
        , copy
        , insert
        , delete
        , modify
        , rewr
        , abst
        , ctt
        , mem
        , group
        ]


did : Parser Delta
did =
    succeed DId
        |. keyword "id"
        |. spaces


dmap : Parser Delta
dmap =
    succeed DMap
        |. keyword "Graphic.map"
        |. spaces
        |= lazy (\_ -> delta)
        |. spaces


dadd : Parser Delta
dadd =
    succeed DAdd
        |. symbol "+"
        |= param
        |. spaces


dmul : Parser Delta
dmul =
    succeed DMul
        |. symbol "*"
        |= param
        |. spaces


list : Parser Delta
list =
    succeed DCons
        |. symbol "["
        |. spaces
        |= lazy (\_ -> delta)
        |= listloop
        |. symbol "]"
        |. spaces


listloop : Parser Delta
listloop =
    loop [] listHelper |> (map deltaListToDCons)


listHelper : List Delta -> Parser (Step (List Delta) (List Delta))
listHelper  revDeltas =
    oneOf
    [ succeed (\d -> Loop (d :: revDeltas))
        |. symbol ","
        |. spaces
        |= lazy (\_ -> delta)
    , succeed ()
        |> map (\_ -> Done (List.reverse revDeltas))
    ]


deltaListToDCons : List Delta -> Delta
deltaListToDCons ls =
    case ls of
        [] ->
            DId
        d :: ts ->
            DCons d (deltaListToDCons ts)


dcons : Parser (Delta -> Delta -> Delta)
dcons =
    succeed DCons
        |. symbol "::"
        |. spaces


dcom : Parser (Delta -> Delta -> Delta)
dcom =
    succeed DCom
        |. symbol "."
        |. spaces


dparens : Parser Delta
dparens =
    succeed identity
        |. symbol "("
        |. spaces
        |= lazy (\_ -> delta)
        |. symbol ")"
        |. spaces


dtuple : Parser Delta
dtuple =
    succeed DTuple
        |. symbol "("
        |. spaces
        |= lazy (\_ -> delta)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> delta)
        |. symbol ")"
        |. spaces


dfun : Parser Delta
dfun =
    succeed DFun
        |. symbol "\\"
        |. spaces
        |= pattern
        |. symbol "->"
        |. spaces
        |= lazy (\_ -> delta)


dapp : Parser Delta
dapp =
    succeed (\p d -> DApp d p)
        |= param
        |. symbol "|>"
        |. spaces
        |= lazy (\_ -> delta)


dgen : Parser Delta
dgen =
    succeed (\d e p -> DGen e d p)
        |. symbol "{"
        |. spaces
        |= lazy (\_ -> delta)
        |. symbol "|"
        |. spaces
        |= exp
        |. symbol "<|"
        |. spaces
        |= param
        |. symbol "}"
        |. spaces


insert : Parser Delta
insert =
    succeed DInsert
        |. keyword "insert"
        |. spaces
        |= int
        |. spaces
        |= param
        |. spaces


delete : Parser Delta
delete =
    succeed DDelete
        |. keyword "delete"
        |. spaces
        |= int
        |. spaces


copy : Parser Delta
copy =
    succeed DCopy
        |. keyword "copy"
        |. spaces
        |= int
        |. spaces


modify : Parser Delta
modify =
    succeed DModify
        |. keyword "modify"
        |. spaces
        |= int
        |. spaces
        |= lazy (\_ -> delta)
        |. spaces


rewr : Parser Delta
rewr =
    succeed DRewr
        |. keyword "rewr"
        |. spaces
        |= param


abst : Parser Delta
abst =
    succeed DAbst
        |. symbol "&"
        |. spaces
        |= param


ctt : Parser Delta
ctt =
    succeed DCtt
        |. symbol "?"
        |. spaces
        |= pattern
        |. symbol "=>"
        |. spaces
        |= delta


mem : Parser Delta
mem =
    succeed DMem
        |. keyword "mem"
        |. spaces
        |= varName
        |. spaces
        |= plist


group : Parser Delta
group =
    succeed DGroup
        |. keyword "group"
        |. spaces
        |= varName
        |. spaces
        |= lazy (\_ -> delta)


-- Param
param : Parser Param
param = buildExpressionParser pop pterm


pop : OperatorTable Param
pop = 
    [ [Infix ( succeed AMul  |. symbol "*"  |. spaces) AssocRight]
    , [Infix ( succeed AAdd  |. symbol "+"  |. spaces) AssocRight]
    , [Infix ( succeed ASub  |. symbol "-"  |. spaces) AssocRight]  
    , [Infix ( succeed ADiv  |. symbol "/"  |. spaces) AssocRight]
    , [Infix ( succeed ALt   |. symbol "<"  |. spaces) AssocRight]
    , [Infix ( succeed ALe   |. symbol "<=" |. spaces) AssocRight]
    , [Infix ( succeed AEq   |. symbol "==" |. spaces) AssocRight]
    , [Infix ( succeed ACons |. symbol "::" |. spaces) AssocRight]
    ]


pterm : Parser Param
pterm =
    oneOf 
        [ pnil
        , ptrue
        , pfalse
        , backtrackable pfloat
        , pvar
        , backtrackable pparens
        , backtrackable ptuple
        , prect
        , pcircle
        , pellipse
        , pline
        , ppolygon
        , plist
        ]


pnil : Parser Param
pnil =
    succeed ANil
        |. symbol "nil"
        |. spaces


ptrue : Parser Param
ptrue =
    succeed ATrue
        |. keyword "true"
        |. spaces


pfalse : Parser Param
pfalse =
    succeed AFalse
        |. keyword "false"
        |. spaces


pfloat : Parser Param
pfloat =
    oneOf
        [ succeed AFloat
            |= number
                { int = Just toFloat
                , hex = Nothing 
                , octal = Nothing
                , binary = Nothing 
                , float = Just identity
                }
            |. spaces
        , succeed (\n -> AFloat (negate n))
            |. symbol "-"
            |= float
            |. spaces
        ]


pvar : Parser Param
pvar =
    oneOf 
    [ succeed AVar
        |= varName
        |. spaces
    , succeed (\n -> AVar ("*" ++ n))
        |. symbol "*"
        |= varName
        |. spaces
    ]
    


pparens : Parser Param
pparens =
    succeed AParens
        |. symbol "("
        |. spaces
        |= lazy (\_ -> param)
        |. symbol ")"
        |. spaces


ptuple : Parser Param
ptuple =
    succeed ATuple
        |. symbol "("
        |. spaces
        |= lazy (\_ -> param)
        |. symbol ","
        |. spaces
        |= lazy (\_ -> param)
        |. symbol ")"
        |. spaces


prect : Parser Param
prect =
    succeed (\a ->
            AGraphic "rect" a)
    |. keyword "rect"
    |. spaces
    |= plist


pcircle : Parser Param
pcircle =
    succeed (\a ->
            AGraphic "circle" a)
    |. keyword "circle"
    |. spaces
    |= plist


pellipse : Parser Param
pellipse =
    succeed (\a ->
            AGraphic "ellipse" a)
    |. keyword "ellipse"
    |. spaces
    |= plist


pline : Parser Param
pline =
    succeed (\a ->
            AGraphic "line" a)
    |. keyword "line"
    |. spaces
    |= plist


ppolygon : Parser Param
ppolygon =
    succeed (\a ->
            AGraphic "polygon" a)
    |. keyword "polygon"
    |. spaces
    |= plist


plist : Parser Param
plist =
    succeed (\a1 a2 -> ACons a1 a2)
        |. symbol "["
        |. spaces
        |= lazy (\_ -> param)
        |= plistloop
        |. symbol "]"
        |. spaces


plistloop : Parser Param
plistloop =
    loop [] plistHelper |> (map paramListToACons)


plistHelper : List Param -> Parser (Step (List Param) (List Param))
plistHelper  revParams =
    oneOf
    [ succeed (\a -> Loop (a :: revParams))
        |. symbol ","
        |. spaces
        |= lazy (\_ -> param)
    , succeed ()
        |> map (\_ -> Done (List.reverse revParams))
    ]


paramListToACons : List Param -> Param
paramListToACons ls =
    case ls of
        [] ->
            ANil
        a :: ls_ ->
            ACons a (paramListToACons ls_)