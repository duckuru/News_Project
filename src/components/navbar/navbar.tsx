import { useContext, useState } from "react";
import { NewsContext } from "@/context/NewsContext";
import { Link, useLocation, useNavigate } from "react-router"; // updated import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // removed faPlus
import { Label } from "../ui/label";

export default function Navbar(props: {
  onLogin: any;
  onSignup: any;
  user: any;
  loginOpen: any;
  setLoginOpen: any;
  signupOpen: any;
  setSignupOpen: any;
}) {
  const { news, setNews } = useContext(NewsContext);
  const { onLogin, onSignup, user, loginOpen, setLoginOpen, signupOpen, setSignupOpen } = props;

  // login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");

  // search state
  const [searchParam, setSearchParam] = useState("");
  const [category, setCategory] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onLogin(loginUsername, loginPassword);
  };

  const handleSignupClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSignup(username, password, conpassword);
  };

  const searchWithCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if(location.pathname != '/'){
      navigate('/', { state: {query: true}});
    }
    if (!searchParam && !category) {
      alert("Please enter a search term or select a category.");
      return;
    }

    console.log("Searching with:", { query: searchParam, category });

    try {
      const response = await fetch(
        `http://localhost:8080/post/search?query=${encodeURIComponent(
          searchParam
        )}&category=${category === "all" ? "" : category}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setNews(data);
      console.log("Search Results:", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-screen bg-[#f3f3f3] px-8 shadow-md h-24 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-[#333] ml-8">
        News App
      </Link>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search for news"
          className="w-[25rem] h-12 border-2"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          onKeyDown={(e) => {
            if(e.key == 'Enter'){
              searchWithCategory();
            }
          }}
        />
        <Select onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-[12rem] border-2 h-12">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="bg-[#f3f3f3] hover:bg-[#e1e1e1] border-2 h-12 w-12 cursor-pointer"
          onClick={searchWithCategory}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#3f3f3f" }} />
        </Button>
      </div>

      {user.user ? (
        <Link to="/profile">
          <img src="/vite.svg" alt="" className="border border-black rounded-full p-2" />
        </Link>
      ) : (
        <span className="auth-btn">
          {/* Login Dialog */}
          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-xl px-6 py-3 mr-3" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl">Login</DialogTitle>
                <DialogDescription>Enter your username and password to log in.</DialogDescription>
              </DialogHeader>
              <form className="text-[#3f3f3f] grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="login-username">Username</Label>
                  <Input id="login-username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} autoFocus />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <DialogFooter className="grid gap-2 w-full">
                  <Button className="w-full p-3" onClick={handleLoginClick}>Login</Button>
                  <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => { setLoginOpen(false); setSignupOpen(true); }}>
                    Don't have an account? Sign Up
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Signup Dialog */}
          <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-xl px-6 py-3" onClick={() => setSignupOpen(true)}>Sign Up</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl">Sign Up</DialogTitle>
                <DialogDescription>Create your account</DialogDescription>
              </DialogHeader>
              <form className="text-[#3f3f3f] grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input id="signup-username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input id="signup-confirm" type="password" value={conpassword} onChange={(e) => setConPassword(e.target.value)} />
                </div>
                <DialogFooter className="grid gap-2 w-full">
                  <Button className="w-full py-3" onClick={handleSignupClick}>Register</Button>
                  <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => { setSignupOpen(false); setLoginOpen(true); }}>
                    Already have an account? Login
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </span>
      )}
    </div>
  );
}
