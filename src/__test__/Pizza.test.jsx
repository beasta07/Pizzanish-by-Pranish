import {render,cleanup} from "@testing-library/react"
import { expect,test,afterEach } from "vitest"
import Pizza from '../Pizza'

afterEach(cleanup)


test("alt test renders on Pizza image", ()=>{
    const name='My Favourite name';
    const src = "https://picsum.photos/200";
    const screen = render(
        <Pizza name={name} description= "super cool yeahhh" image={src} />
    )
    const img = screen.getByRole("img");
    expect (img.src).toBe(src)
    expect (img.alt).toBe(name)
})
test("to have default image if none is provided", ()=>{
    const screen = render (
        <Pizza name='Something else' description="pizza " />
    )
    const img= screen.getByRole("img")
    expect (img.src).not.toBe("")
})