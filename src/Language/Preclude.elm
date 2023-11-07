module Language.Preclude exposing (..)


library : String
library = """cp n ls :=
    case ls of
    []    -> [] |
    x::xs ->
        case n of
        0     -> x::x::xs |
        other -> x::cp (n-1) xs;

del n ls :=
    case ls of
    []    -> [] |
    x::xs ->
        case n of
        0     -> xs |
        other -> x::del (n-1) xs;

mod n f ls :=
    case ls of
    []    -> [] |
    x::xs ->
        case n of
        0     -> f x::xs |
        other -> x::mod (n-1) f xs;

ins n x ls :=
    case ls of
    []    -> [x] |
    y::ys ->
        case n of
        0     -> x::y::ys |
        other -> y::ins (n-1) x ys;

nth n ls :=
    case ls of
    []    -> 9999 |
    x::xs ->
        case n of
        0     -> x |
        other -> nth (n-1) xs;

first (x,y) = x;
second (x,y) = y;

"""