import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function useFetchUserClient() {
	const [user, setUser] = useState({});
	const supabase = createClient();
	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		setUser(user);
	};
	useEffect(() => {
		fetchUser();
	}, []);
	return { user };
}
