import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileInfo({ user, dispatch }: { user: any; dispatch: any }) {
  const [username, setUsername] = useState(user?.user?.username || "");
  const [password] = useState(user?.user?.password || "");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const handleUpdateInfo = async () => {
    console.log(password, newPassword, conPassword);
    if (username && newPassword && conPassword) {
      if (newPassword === conPassword) {
        fetch(`http://localhost:8080/users/${user?.user?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: username, password: newPassword }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            dispatch({ type: "SET_USER", payload: data });
            setNewPassword("");
            setConPassword("");
          });
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div>
        <span className="font-semibold text-gray-700">Username: </span>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2"
        />
      </div>
      
      <div>
        <span className="font-semibold text-gray-700">Current Password: </span>
        <Input
          type="password"
          value={password}
          disabled
          className="mt-2"
        />
      </div>

      <div>
        <span className="font-semibold text-gray-700">New Password: </span>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <span className="font-semibold text-gray-700">Confirm Password: </span>
        <Input
          type="password"
          value={conPassword}
          onChange={(e) => setConPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      <Button
        className="mx-auto w-80 py-5 cursor-pointer mt-4"
        onClick={handleUpdateInfo}
      >
        Submit
      </Button>
    </div>
  );
}