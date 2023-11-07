module Parser.Exp exposing (..)

import Parser exposing (..)
import Parser.Extras exposing (..)
import Parser.Expression exposing (..)
import Language.Syntax exposing (..)
import Parser.Utils exposing (..)
import Parser.Pattern exposing (..)
import Parser.WhiteSpace exposing (..)

parse : String -> Result (List DeadEnd) Exp
parse =
    -- run (exp |. end)
    run (equationLoop |. end)


exp : Parser Exp
exp =
    buildExpressionParser operators (lazy <| \_ -> term_app)


operators : OperatorTable Exp
operators =
    [  [Prefix (backtrackable (uopParser "-" Neg))]
    ,  [Prefix (uopParser "!" Not)]

    , [Infix (bopParser "%" Mod) AssocLeft]

    , [Infix (bopParser "*" Mul) AssocLeft
    ,  Infix (bopParser "/" Div) AssocLeft]

    , [Infix (backtrackable (bopParser "+" Add)) AssocLeft
    ,  Infix (bopParser "-" Sub) AssocLeft]

    , [Infix (bopParser "++" Cat) AssocLeft]

    , [Infix (backtrackable (bopParser "<" Lt)) AssocNone
    ,  Infix (backtrackable (bopParser ">" Gt)) AssocNone]

    , [Infix (bopParser "<=" Le) AssocNone
    ,  Infix (bopParser ">=" Ge) AssocNone]

    , [Infix (bopParser "==" Eq) AssocNone]
    , [Infix (bopParser "&&" And) AssocLeft]
    , [Infix (bopParser "||" Or) AssocLeft]

    , [Infix cons AssocRight]
    ]


-- Application
flip : (a -> b -> c) -> b -> a -> c
flip f x y = f y x


term_app : Parser Exp
term_app =
    let
        foldl1 f (x, xs) =
            List.foldl (flip f) x xs
    in
        succeed (foldl1 (EApp []))
            |= some aexpr


-- No Applications & Operations
aexpr : Parser Exp
aexpr =
    oneOf
    [ emap
    , unwrap
    , rect
    , circle
    , ellipse
    , line
    , polygon
    -- , copy
    -- , insert
    -- , delete
    -- , modify
    , group
    , backtrackable mparens
    , backtrackable tuple
    , true
    , false
    , backtrackable mfloat
    , backtrackable var
    , abs
    , mlet
    , letrec
    , caseOf
    , backtrackable nil
    , backtrackable list
    , char
    , string
    , backtrackable empList
    ]


emap : Parser Exp
emap =
    succeed (\spc e1 e2 -> EMap [spc] e1 e2)
        |. keyword "Graphic.map"
        |= mspaces
        |= lazy (\_ -> aexpr)
        |= lazy (\_ -> aexpr)


unwrap : Parser Exp
unwrap =
    succeed (\spc e -> EUnwrap [spc] e)
        |. keyword "Graphic.unwrap"
        |= mspaces
        |= lazy (\_ -> aexpr)


-- EFloat
mfloat : Parser Exp
mfloat =
    succeed (\n spc -> EFloat [spc] n)
        |= number
            { int = Just toFloat
            , hex = Nothing 
            , octal = Nothing
            , binary = Nothing 
            , float = Just identity
            }
        |= mspaces

-- , succeed (\n spc -> EFloat [spc] (negate n))
--     |. symbol "-"
--     |= float
--     |= mspaces


-- ETrue
true : Parser Exp
true =
    succeed (\spc -> ETrue [spc])
        |. keyword "true"
        |= mspaces


-- EFalse
false : Parser Exp
false =
    succeed (\spc -> EFalse [spc])
        |. keyword "false"
        |= mspaces


-- EChar
char : Parser Exp
char =
    succeed (\c spc -> EChar [spc] c)
        |. symbol "\'"
        |= mchar
        |. symbol "\'"
        |= mspaces


-- EString
string : Parser Exp
string =
    succeed (\s spc -> EString [spc] s)
        |. symbol "\""
        |= mstring
        |. symbol "\""
        |= mspaces


-- EVar
var : Parser Exp
var =
    oneOf 
    [ succeed (\vn spc -> EVar [spc] vn)
        |= varName
        |= mspaces
    , succeed (\vn spc -> EVar [spc] ("*" ++ vn))
        |. symbol "*"
        |= varName
        |= mspaces
    ]
    


-- ELam
abs : Parser Exp
abs =
    succeed (\spc1 p spc2 e -> ELam [spc1, spc2] p e)
        |. symbol "\\"
        |= mspaces
        |= pattern
        |. symbol "->"
        |= mspaces
        |= lazy (\_ -> exp)


-- ELet
mlet : Parser Exp
mlet =
    succeed (\spc1 p spc2 e1 spc3 e2 -> 
    EApp ["LET", spc1, spc2, spc3] (ELam [] p e2) e1)
        |. keyword "let"
        |= mspaces
        |= pattern
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> exp)
        |. keyword "in"
        |= mspaces
        |= lazy (\_ -> exp)


-- ELetrec
letrec : Parser Exp
letrec =
    succeed (\spc1 p spc2 e1 spc3 e2 -> 
    EApp ["LETREC", spc1, spc2, spc3] (ELam [] p e2) (EFix [] (ELam [] p e1)))
        |. keyword "letrec"
        |= mspaces
        |= pattern
        |. symbol "="
        |= mspaces
        |= lazy (\_ -> exp)
        |. keyword "in"
        |= mspaces
        |= lazy (\_ -> exp)


-- ECase
caseOf : Parser Exp
caseOf =
    succeed (\spc1 e spc2 b -> ECase [spc1, spc2] e b)
        |. keyword "case"
        |= mspaces
        |= lazy (\_ -> exp)
        |. keyword "of"
        |= mspaces
        |= branch


-- EEmpList
empList : Parser Exp
empList =
    succeed (\spc1 spc2 -> EEmpList [spc1, spc2])
        |. symbol "["
        |= mspaces
        |. symbol "]"
        |= mspaces


-- ENil
nil : Parser Exp
nil =
    succeed (\spc -> ENil [spc])
        |. symbol "nil"
        |= mspaces


-- EList
list : Parser Exp
list =
    succeed (\spc1 e1 e2 spc2 -> EList [spc1, spc2] e1 e2)
        |. symbol "["
        |= mspaces
        |= lazy (\_ -> exp)
        |= listloop
        |. symbol "]"
        |= mspaces


listloop : Parser Exp
listloop =
    loop [] listHelper |> (map exprListToEList)


listHelper : List (Exp, WS) -> Parser (Step (List (Exp, WS)) (List (Exp, WS)))
listHelper  revExps =
    oneOf
    [ succeed (\spc e -> Loop ((e, [spc]) :: revExps))
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> exp)
    , succeed ()
        |> map (\_ -> Done (List.reverse revExps))
    ]


exprListToEList : List (Exp, WS) -> Exp
exprListToEList ls =
    case ls of
        [] ->
            EEmpList []
        (e, ws) :: ts ->
            EList ws e (exprListToEList ts)


cons : Parser (Exp -> Exp -> Exp)
cons =
    succeed (\spc -> ECons [spc])
        |. symbol "::"
        |= mspaces


-- ETuple 
tuple : Parser Exp
tuple =
    succeed (\spc1 e1 spc2 e2 spc3 -> ETuple [spc1, spc2, spc3] e1 e2)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> exp)
        |. symbol ","
        |= mspaces
        |= lazy (\_ -> exp)
        |. symbol ")"
        |= mspaces


-- EParens
mparens : Parser Exp
mparens =
    succeed (\spc1 e spc2 -> EParens [spc1, spc2] e)
        |. symbol "("
        |= mspaces
        |= lazy (\_ -> exp)
        |. symbol ")"
        |= mspaces


-- copy : Parser Exp
-- copy =
--     succeed (\s e1 e2 ->
--             ECopy [s] e1 e2)
--     |. keyword "copy"
--     |= mspaces
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)


-- insert : Parser Exp
-- insert =
--     succeed (\s e1 e2 e3 ->
--             EInsert [s] e1 e2 e3)
--     |. keyword "insert"
--     |= mspaces
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)


-- delete : Parser Exp
-- delete =
--     succeed (\s e1 e2 ->
--             EDelete [s] e1 e2)
--     |. keyword "delete"
--     |= mspaces
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)


-- modify : Parser Exp
-- modify =
--     succeed (\s e1 e2 e3 ->
--             EModify [s] e1 e2 e3)
--     |. keyword "modify"
--     |= mspaces
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)
--     |= lazy (\_ -> aexpr)


rect : Parser Exp
rect =
    succeed (\s e ->
            EGraphic [s] "rect" e)
    |. keyword "rect"
    |= mspaces
    |= list


circle : Parser Exp
circle =
    succeed (\s e->
            EGraphic [s] "circle" e)
    |. keyword "circle"
    |= mspaces
    |= list


ellipse : Parser Exp
ellipse =
    succeed (\s e ->
            EGraphic [s] "ellipse" e)
    |. keyword "ellipse"
    |= mspaces
    |= list


line : Parser Exp
line =
    succeed (\s e ->
            EGraphic [s] "line" e)
    |. keyword "line"
    |= mspaces
    |= list


polygon : Parser Exp
polygon =
    succeed (\s e ->
            EGraphic [s] "polygon" e)
    |. keyword "polygon"
    |= mspaces
    |= list


group : Parser Exp
group =
    succeed (\s e ->
            EGraphic [s] "g" e)
    |. keyword "g"
    |= mspaces
    |= list 


-- Operations
bopParser : String -> Bop -> Parser (Exp -> Exp -> Exp)
bopParser s op =
    succeed (\spc -> EBPrim [spc] op)
        |. symbol s
        |= mspaces


uopParser : String -> Uop -> Parser (Exp -> Exp)
uopParser s op =
    succeed (\spc -> EUPrim [spc] op)
        |. symbol s
        |= mspaces


-- Branch
sinBranch : Parser Branch
sinBranch = 
    succeed (\p spc e -> BSin [spc] p e)
        |= pattern
        |. symbol "->"
        |= mspaces
        |= lazy (\_ -> exp)


branchOp : OperatorTable Branch
branchOp = [[Infix ( succeed (\spc -> BCom [spc])
                        |. symbol "|"
                        |= mspaces
                    ) 
            AssocRight]]


branch : Parser Branch
branch = buildExpressionParser branchOp sinBranch


-- Equations
statement : Parser (Exp -> Exp)
statement =
    oneOf
        [ backtrackable equation
        , recursion
        ]


equation : Parser (Exp -> Exp)
equation = 
    succeed (\p spc1 params spc2 e1 spc3 -> \e2 ->
            EApp ["EQ", spc1, spc2, spc3] (ELam [] p e2) (getFuncDef params e1))
        |= pvar
        |= mspaces
        |= paramLoop
        |. symbol "="
        |= mspaces
        |= exp
        |. symbol ";"
        |= mspaces


recursion : Parser (Exp -> Exp)
recursion = 
    succeed (\p spc1 params spc2 e1 spc3 -> \e2 ->
            (EFix [] (ELam [] p (getFuncDef params e1)))
            |> EApp ["Rec", spc1, spc2, spc3] (ELam [] p e2))
        |= pvar
        |= mspaces
        |= paramLoop
        |. symbol ":="
        |= mspaces
        |= exp
        |. symbol ";"
        |= mspaces


getFuncDef : List Pattern -> Exp -> Exp
getFuncDef params e =
    case params of
        []      -> e
        p :: ps -> ELam [] p (getFuncDef ps e)


paramLoop : Parser (List Pattern)
paramLoop =
    loop [] paramHelper


paramHelper : List Pattern -> Parser (Step (List Pattern) (List Pattern))
paramHelper revExps =
    oneOf
    [ succeed (\p -> Loop (p :: revExps))
        |= pattern
    , succeed ()
        |> map (\_ -> Done (List.reverse revExps))
    ]


equationLoop : Parser Exp
equationLoop =
    loop [] equationHelper |>
    Parser.andThen 
        (\ls -> 
            List.foldr (\f e -> f e) (EVar [] "main") ls 
            |> Parser.succeed
        )

equationHelper : List (Exp -> Exp) -> 
                Parser (Step (List (Exp -> Exp)) (List (Exp -> Exp)))
equationHelper revExps = 
    oneOf
    [ succeed (\f -> Loop (f :: revExps))
        |= statement
    , succeed ()
        |> map (\_ -> Done (List.reverse revExps))
    ]