import { useCallback, useState } from "react";

export const EMPTY_HOLE = { diameter: "", count: "" };
export const EMPTY_RECT_HOLE = { a: "", b: "", count: "" };

/**
 * Stan listy otworów kołowych i czworokątnych (używany z HolesOptions).
 */
export default function useHoles() {
    const [holes, setHoles] = useState([EMPTY_HOLE]);
    const [rectHoles, setRectHoles] = useState([EMPTY_RECT_HOLE]);

    const resetHoles = useCallback(() => {
        setHoles([EMPTY_HOLE]);
        setRectHoles([EMPTY_RECT_HOLE]);
    }, []);

    return { holes, setHoles, rectHoles, setRectHoles, resetHoles };
}
