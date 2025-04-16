import { useEffect, useState } from "react";

type FilterableUser = {
  first_name?: string;
  last_name?: string;
  fav_artist?: string;
};

const useFilterUsers = <T extends FilterableUser>(users: T[], searchQuery: string) => {
  const [filteredUsers, setFilteredUsers] = useState<T[]>(users);

  useEffect(() => {
    const searchLower = searchQuery.toLowerCase();

    const filtered = users.filter((user) => {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const artists = (user.fav_artist || "").toLowerCase();

      return (
        fullName.includes(searchLower) ||
        artists.includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
  }, [searchQuery]);

  return {
    filteredUsers,
  };
};

export default useFilterUsers;
