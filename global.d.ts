/// <reference types="svelte" />
interface MutableObject {
    [key: string | number | symbol]: any
}

interface MaterialUniform {
    type: string
    data: string
    key: string

}

type GenericVoidFunctionWith3P<T, R, V> = (param1: T, param2: R, param3: V) => void
type GenericVoidFunctionWith4P<T, R, V, W> = (param1: T, param2: R, param3: V, param4: W) => void
type GenericVoidFunctionWith2P<T, R> = (param1: T, param2: R) => void
type GenericVoidFunctionWithP<T> = (param1: T) => void
type GenericVoidFunction = () => void
type GenericNonVoidFunctionWithP<T, R> = (state: T) => R
type GenericNonVoidFunction<R> = () => R

