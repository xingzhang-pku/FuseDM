module Parser.WhiteSpace exposing (..)

import Parser exposing (..)

mspaces : Parser String
mspaces =
    getChompedString (chompWhile isWhiteSpace)


isWhiteSpace : Char -> Bool
isWhiteSpace c =
    c == ' ' || c == '\n' || c == '\r'