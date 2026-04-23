import type { ReactNode, FC } from "react"

interface Props {
    children: ReactNode
}

export const DirectoryLayout:FC<Props> = ({children}) => {
    return (
        <>
            <header>Header</header>
            {children}
            <footer>Footer</footer>
        </>
    )
}