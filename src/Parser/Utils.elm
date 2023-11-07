module Parser.Utils exposing (..)

import Set
import Parser exposing (..)

varName : Parser String
varName =
    variable
    { start = Char.isAlpha
    , inner = \c -> Char.isAlphaNum c || c == '_'
    , reserved = Set.fromList <|
            [ "rect"
            , "circle"
            , "ellipse"
            , "line"
            , "polygon"
            , "g"
            , "if"
            , "id"
            , "in"
            , "of"
            , "not"
            , "let"
            , "nil"
            , "then"
            , "else"
            , "true"
            , "rewr"
            , "case"
            , "false"
            , "letrec"
            , "copy"
            , "insert"
            , "delete"
            , "modify"
            , "mem"
            , "group"
            , "Graphic.map"
            , "Graphic.unwrap"
            ]
    }


mchar : Parser Char
mchar = 
    map charhelper (getChompedString (chompIf (\_ -> True)))


charhelper : String -> Char
charhelper s =
    case (String.uncons s) of
        Just (c, _) -> c
        Nothing     -> ' '


mstring : Parser String
mstring = 
    getChompedString (chompUntil "\"")