import { useEffect, useState } from "react";
import { COLAPSES_STORAGE_KEY } from "shared/constants";

export const useColapses = () => {
    const [colapses, setColapses] = useState<Record<string, boolean>>({});

    const getColapses = () => {
        const raw = localStorage.getItem(COLAPSES_STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    }

    useEffect(() => {
        const colapses = getColapses()
        setColapses(colapses)
    }, []);

    const saveInLocalStorage = (colapses: Record<string, boolean>) => {
        localStorage.setItem(COLAPSES_STORAGE_KEY, JSON.stringify(colapses))
    }

    const toggle = (key: string) => {
        const newColapses = {
            ...colapses,
            [key]: !colapses[key],
        }
        setColapses(newColapses)
        saveInLocalStorage(newColapses)
    }

    return {
        colapses,
        toggle,
    }
}
