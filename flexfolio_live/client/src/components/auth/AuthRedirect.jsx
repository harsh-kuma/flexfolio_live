"use client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../common/loader/Loader";

export default function AuthRedirect({ children, }) {

    const router = useRouter();

    const {
        user,
        loading,
    } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // WAIT WHILE CHECKING LOGIN

    if (loading) {
        return (
            <Loader/>
        );
    }

    // IF USER LOGGED IN

    if (user) return null;

    // IF USER NOT LOGGED IN

    return children;
}