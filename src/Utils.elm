module Utils exposing (..)

lookup : String -> List (String, a) -> Maybe a
lookup key list =
    case List.filter (\(k, _) -> k == key) list of
        []          -> Nothing
        (_, v) :: _ -> Just v


setLast : a -> List a -> List a
setLast item list =
    case List.reverse list of
        [] ->
            [item]

        _ :: rest ->
            List.reverse (item :: rest)