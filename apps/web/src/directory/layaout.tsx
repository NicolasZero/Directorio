import type { ReactNode, FC } from "react"

interface Props {
    children: ReactNode
}

export const DirectoryLayout:FC<Props> = ({children}) => {
    return (
        <>
            <header>Selector de estado</header>
            {children}
            {/* <footer>Footer</footer> */}
        </>
    )
}