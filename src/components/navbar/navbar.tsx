import { useContext, useState } from "react";
import { NewsContext } from "@/context/NewsContext";
import { Link } from "react-router"; // use react-router-dom instead of react-router
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
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { plusIcon } from '@fortawesome/'
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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
  //TODO: show error message, especially "name already exist";
  //extract prop
  const {
    onLogin,
    onSignup,
    user,
    loginOpen,
    setLoginOpen,
    signupOpen,
    setSignupOpen,
  } = props;

  //login usestate
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //signup usestate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");

  const [searchParam, setSearchParam] = useState("");
  const [category, setCategory] = useState("");

  //news useState
  const [headline, setHeadline] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [content, setContent] = useState("");

  // post dialog state
  const [postOpen, setPostOpen] = useState(false);

  const handleLoginClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onLogin(loginUsername, loginPassword);
  };

  const handleSignupClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSignup(username, password, conpassword);
  };

  const handleNewsPost = (e) => {
    console.log(headline, postCategory, content);
    e.preventDefault();
    fetch('http://localhost:8080/post/', {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ headline, category: postCategory, content })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        setPostOpen(false);
      });
  }

  const searchWithCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // stop form from reloading page
    if (!searchParam && !category) {
      alert("Please enter a search term or select a category.");
      return;
    }

    console.log("Searching with:", {
      query: searchParam,
      category: category || "all",
    });

    try {
      const response = await fetch(
        `http://localhost:8080/post/search?query=${encodeURIComponent(
          searchParam
        )}&category=${category}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setNews(data);
      console.log("Search Results:", data);
      // TODO: Pass this data to a parent state or display it on the page
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
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#3f3f3f" }}
          />
        </Button>
      </div>
      {user.user ? (
        <>
          <Dialog open={postOpen} onOpenChange={() => { setPostCategory(""); setPostOpen(!postOpen) }}>
            <DialogTrigger asChild>
              <FontAwesomeIcon icon={faPlus} style={{ color: "#3f3f3f" }} />
              {/* <Button variant="outline" className="text-xl px-6 py-3 mr-3" onClick={() => setLoginOpen(true)}>Login</Button> */}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl">
                  Create Post
                </DialogTitle>
                <DialogDescription>
                  Upload your news to the world!
                </DialogDescription>
              </DialogHeader>

              <form className="text-[#3f3f3f] grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="news-headline">Headline</Label>
                  <Input
                    id="news-headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    autoFocus
                    maxLength={60}
                  />
                </div>
                <Select onValueChange={(value) => setPostCategory(value)}>
                  <SelectTrigger className="w-[12rem] border-2 h-12">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
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
                <div className="grid gap-3">
                  <Label htmlFor="news-content">Content</Label>
                  <Textarea
                    id="news-content"
                    className="resize-none"
                    maxLength={300}
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <DialogFooter className="grid gap-2 w-full">
                  <Button className="w-full p-3" onClick={handleNewsPost}>
                    Upload
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Link to="/profile">
            <img
              src="/vite.svg"
              alt=""
              className="border border-black rounded-full p-2"
            />
          </Link>
        </>
      ) : (
        <>
          {/* Auth Dialog (Login/Signup toggle) */}
          <span className="auth-btn">
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xl px-6 py-3 mr-3"
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-3xl">
                    Login
                  </DialogTitle>
                  <DialogDescription>
                    Enter your username and password to log in.
                  </DialogDescription>
                </DialogHeader>

                <form className="text-[#3f3f3f] grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="grid gap-2 w-full">
                    <Button className="w-full p-3" onClick={handleLoginClick}>
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => {
                        setLoginOpen(false);
                        setSignupOpen(true);
                      }}
                    >
                      Don't have an account? Sign Up
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* sign up button   */}
            <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xl px-6 py-3"
                  onClick={() => setSignupOpen(true)}
                >
                  Sign Up
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-3xl">
                    Sign Up
                  </DialogTitle>
                  <DialogDescription>Create your account</DialogDescription>
                </DialogHeader>

                <form className="text-[#3f3f3f] grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={conpassword}
                      onChange={(e) => setConPassword(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="grid gap-2 w-full">
                    <Button className="w-full py-3" onClick={handleSignupClick}>
                      Register
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => {
                        setSignupOpen(false);
                        setLoginOpen(true);
                      }}
                    >
                      Already have an account? Login
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </span>
        </>
      )}
    </div>
  );
}
