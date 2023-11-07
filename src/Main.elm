port module Main exposing (..)

import View
import Html exposing (..)
import Model exposing (..)
import Browser exposing (..)
import Parser.Exp as ExpParser
import Language.FEval exposing (feval)
import Language.BEval exposing (beval)
import Language.Preclude exposing (library)
import Printer.Exp as ExpPrinter
import Parser.Delta as DeltaParser
import Printer.Value exposing (printGraphics)


main : Program () Model Msg
main =
    Browser.element
        { init          = init
        , update        = update
        , view          = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ = (Model.initModel, Cmd.none)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Execute code ->
            case ExpParser.parse (library ++ code) of
                Ok exp ->
                    let
                        v = feval [] exp
                        -- _ = Debug.log "v" (Printer.Value.print v)
                    in
                    ( { model | exp = exp}
                    , printGraphics v |> genCanvas)

                Err info ->
                    let _ = Debug.log "Parse Exp" (Debug.toString info) in
                    ( model, Cmd.none )
        -- ?x=>([&x,id].[id,rewr x])
        -- ?x=>(([&x,id]::id) . ([id,rewr x]::id))
        -- [?x=>(([&x,id]) . ([id,rewr x]))]
        Change d ->
            case DeltaParser.parse d of
                Ok delta ->
                    let
                        _ = Debug.log "Parse Delta" (Debug.toString delta)
                        (_, exp1, _) = beval [] model.exp delta []
                        newCode = exp1 |> ExpPrinter.print |> String.dropLeft (String.length library)
                    in
                    ( { model | exp = exp1 }, retNewCode newCode)

                Err info ->
                    let _ = Debug.log "Parse Delta" (Debug.toString info) in
                    ( model, Cmd.none )
        
        SelectFile f -> (model, retCodeFile f)


view : Model -> Html Msg
view = View.view


port exeCode    : (String -> msg) -> Sub msg
port changeCode : (String -> msg) -> Sub msg
port getEdit    : (String -> msg) -> Sub msg

port retNewCode  : String -> Cmd msg
port retCodeFile : String -> Cmd msg
port retEditFile : String -> Cmd msg
port genCanvas   : String -> Cmd msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch 
        [ exeCode Execute
        , changeCode Change
        , getEdit Change
        ]