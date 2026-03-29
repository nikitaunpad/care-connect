import { useState } from "react";
/*import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector17 from "./vector-17.svg";
import vector18 from "./vector-18.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";
import vector21 from "./vector-21.svg";
import vector22 from "./vector-22.svg";
import vector23 from "./vector-23.svg";*/

const ROLE_OPTIONS = [
  { id: "victim", label: "Victim", selected: true },
  { id: "psychologist", label: "Psychologist", selected: false },
  { id: "donor", label: "Donor", selected: false },
  { id: "admin", label: "Admin", selected: false },
];

const FOOTER_LINKS = [
  { label: "Privacy Guide", width: "w-[74.42px]" },
  { label: "Community Standards", width: "w-[118.75px]" },
  { label: "Contact", width: "w-[41.41px]" },
];

export const LoginRegisterSubsection = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [selectedRole, setSelectedRole] = useState("victim");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f3ed]">
      <header className="h-20 items-center justify-between pl-12 pr-[47.99px] py-0 self-stretch w-full bg-[#f7f3ed] flex relative border-b [border-bottom-style:solid] border-[#d0d5cb]">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <div className="flex w-8 h-8 items-center justify-center relative bg-[#193c1f] rounded-md">
            <div className="relative w-5 h-5">
              <img
                className="absolute w-[91.67%] h-[91.90%] top-[8.10%] left-[8.33%]"
                alt="CareConnect logo"
                src={null}
              />
            </div>
          </div>

          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <div className="relative flex items-center w-[149.5px] h-8 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-2xl tracking-[0] leading-8 whitespace-nowrap">
              CareConnect
            </div>
          </div>
        </div>

        <button
          type="button"
          className="all-[unset] box-border inline-flex flex-col items-center justify-center px-6 py-2 relative flex-[0_0_auto] rounded-lg border-2 border-solid border-[#8ea087] cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-[89.88px] h-6 [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
            Help Center
          </div>
        </button>
      </header>

      <div className="flex self-stretch w-full flex-[0_0_auto] items-start relative">
        <section className="flex flex-col w-[576px] items-center justify-center p-16 relative self-stretch bg-[#ede4d8] overflow-hidden">
          <div className="absolute w-[66.67%] h-[43.69%] top-[-10.00%] left-[43.33%] bg-[#f7f3ed] rounded-full opacity-60" />
          <div className="absolute w-[86.81%] h-[56.88%] top-[58.12%] left-[-15.00%] bg-[#f7f3ed] rounded-full opacity-40" />

          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex flex-col w-24 h-[136px] items-start pt-0 pb-10 px-0 relative">
              <div className="flex w-24 h-24 items-center justify-center relative bg-[#f7f3ed] rounded-full shadow-[0px_1px_2px_#0000000d]">
                <div className="relative w-12 h-12">
                  <img
                    className="absolute w-[87.50%] h-[91.67%] top-[8.33%] left-[12.50%]"
                    alt="Privacy shield"
                    src={null}
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex pt-0 pb-6 px-0 relative flex-[0_0_auto] flex-col items-start">
              <div className="inline-flex flex-col items-center pl-[62.91px] pr-[62.92px] py-0 relative flex-[0_0_auto]">
                <h2 className="relative w-[322.17px] h-20 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-4xl text-center tracking-[0] leading-10">
                  Your privacy is our
                  <br />
                  priority
                </h2>
              </div>
            </div>

            <div className="relative max-w-md w-[448px] h-[135.75px]">
              <div className="inline-flex flex-col max-w-md items-center px-[1.44px] py-0 relative -top-px opacity-80">
                <p className="relative w-[445.12px] h-[88px] mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-[#193c1f] text-lg text-center tracking-[0] leading-[29.2px]">
                  We provide a safe, encrypted environment for everyone.
                  <br />
                  Choose to remain anonymous while receiving the
                  <br />
                  support you need.
                </p>
              </div>
            </div>

            <div className="flex max-w-md items-start justify-center gap-6 relative w-full flex-[0_0_auto]">
              <div className="flex flex-col items-center justify-center p-5 relative flex-1 self-stretch grow bg-[#f7f3edcc] rounded-xl border border-solid border-[#d0d5cb]">
                <div className="w-6 h-8 pt-0 pb-2 px-0 flex flex-col items-start relative">
                  <div className="flex flex-col w-6 h-6 items-center justify-center relative">
                    <div className="relative w-6 h-6">
                      <img
                        className="absolute w-[91.67%] h-[91.90%] top-[8.10%] left-[8.33%]"
                        alt="Encryption icon"
                        src={null}
                      />
                    </div>
                  </div>
                </div>

                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="relative flex items-center justify-center w-[147.92px] h-5 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                    End-to-End Encrypted
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-5 relative flex-1 self-stretch grow bg-[#f7f3edcc] rounded-xl border border-solid border-[#d0d5cb]">
                <div className="w-6 h-8 pt-0 pb-2 px-0 flex flex-col items-start relative">
                  <div className="flex flex-col w-6 h-6 items-center justify-center relative">
                    <div className="relative w-6 h-6">
                      <img
                        className="absolute w-[93.93%] h-[91.67%] top-[8.33%] left-[6.07%]"
                        alt="Anonymous icon"
                        src={null}
                      />
                    </div>
                  </div>
                </div>

                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="relative flex items-center justify-center w-[137.28px] h-5 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                    Anonymous Options
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col w-[704px] items-center justify-center p-16 relative self-stretch">
          <div className="relative max-w-md w-[448px] h-[745px]">
            <div className="flex w-full items-start justify-center absolute top-0 left-0 border-b [border-bottom-style:solid] border-[#d0d5cb]">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`all-[unset] box-border flex flex-col items-center justify-center px-0 py-4 relative flex-1 grow cursor-pointer ${activeTab === "login" ? "" : "opacity-60"}`}
              >
                <div className="relative flex items-center justify-center w-[43.39px] h-6 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                  Login
                </div>
                {activeTab === "login" && (
                  <div className="absolute w-full left-0 bottom-0 h-1 bg-[#8ea087]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`all-[unset] box-border flex flex-col items-center justify-center px-0 py-4 relative flex-1 grow cursor-pointer ${activeTab === "register" ? "" : "opacity-60"}`}
              >
                <div className="relative flex items-center justify-center w-[63.95px] h-6 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                  Register
                </div>
                {activeTab === "register" && (
                  <div className="absolute w-full left-0 bottom-0 h-1 bg-[#8ea087]" />
                )}
              </button>
            </div>

            <div className="flex flex-col w-full items-start gap-3 absolute top-[97px] left-0">
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm tracking-[0] leading-5">
                  Join as a:
                </div>
              </div>

              <div className="grid grid-cols-4 grid-rows-[48px] h-fit gap-3">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`all-[unset] box-border relative w-fit h-fit inline-flex flex-col items-center justify-center py-3 cursor-pointer rounded-lg ${
                      selectedRole === role.id
                        ? "px-[28.53px] bg-[#f7f3ed] border-2 border-solid border-[#8ea087]"
                        : "px-[11.48px] bg-white border border-solid border-[#d0d5cb]"
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center h-5 text-sm text-center tracking-[0] leading-5 whitespace-nowrap ${
                        selectedRole === role.id
                          ? "[font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f]"
                          : "[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-[#193c1f]"
                      }`}
                    >
                      {role.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col w-full items-start gap-6 absolute top-[209px] left-0">
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm tracking-[0] leading-5"
                    htmlFor="input-1"
                  >
                    Username
                  </label>
                </div>

                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center pl-12 pr-4 pt-[15px] pb-3.5 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden border border-solid border-[#d0d5cb]">
                    <input
                      className="pt-px pb-0.5 px-0 relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] outline-none"
                      id="input-1"
                      placeholder="Choose a username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="inline-flex flex-col h-[40.00%] items-start absolute top-[30.00%] left-4">
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-[83.33%] h-[91.67%] top-[8.33%] left-[16.67%]"
                        alt="Username icon"
                        src={null}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm tracking-[0] leading-5"
                    htmlFor="input-2"
                  >
                    Email Address
                  </label>
                </div>

                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center pl-12 pr-4 pt-[15px] pb-3.5 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden border border-solid border-[#d0d5cb]">
                    <input
                      className="pt-px pb-0.5 px-0 relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] outline-none"
                      id="input-2"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="inline-flex flex-col h-[40.00%] items-start absolute top-[30.00%] left-4">
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-[91.67%] h-[83.33%] top-[16.67%] left-[8.33%]"
                        alt="Email icon"
                        src={null}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-sm tracking-[0] leading-5"
                    htmlFor="input-3"
                  >
                    Password
                  </label>
                </div>

                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center pt-[15px] pb-3.5 px-12 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden border border-solid border-[#d0d5cb]">
                    <input
                      className="pt-px pb-0.5 px-0 relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] outline-none"
                      id="input-3"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="inline-flex flex-col h-[40.00%] items-start absolute top-[30.00%] left-4">
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-[87.50%] h-[91.67%] top-[8.33%] left-[12.50%]"
                        alt="Password icon"
                        src={null}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="all-[unset] box-border inline-flex flex-col h-[40.00%] items-start absolute top-[30.00%] right-4 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-[66.67%] h-[66.67%] top-[33.33%] left-[33.33%]"
                        alt="Toggle password visibility"
                        src={null}
                      />
                      <img
                        className="absolute w-[93.93%] h-[83.33%] top-[16.67%] left-[6.07%]"
                        alt=""
                        src={null}
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div
                className="items-start gap-4 p-6 bg-[#f7f3ed80] flex relative self-stretch w-full flex-[0_0_auto] rounded-xl border border-solid border-[#d0d5cb] cursor-pointer"
                onClick={() => setAnonymous(!anonymous)}
              >
                <div className="flex flex-col w-5 h-6 items-start pt-1 pb-0 px-0 relative">
                  <div
                    className={`relative w-5 h-5 rounded border border-solid border-[#d0d5cb] ${anonymous ? "bg-[#8ea087]" : "bg-white"}`}
                  />
                </div>

                <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative flex items-center w-[173.8px] h-6 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-[#193c1f] text-base tracking-[0] leading-6 whitespace-nowrap">
                      Register Anonymously
                    </div>
                  </div>

                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] opacity-60">
                    <p className="relative flex items-center w-[235.56px] h-4 mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-[#193c1f] text-xs tracking-[0] leading-4 whitespace-nowrap">
                      Your identity will be hidden from other users.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center px-0 py-4 relative self-stretch flex-[0_0_auto] bg-[#8ea087] w-full rounded-xl cursor-pointer border-none"
              >
                <div className="absolute h-full top-0 left-0 bg-[#ffffff01] shadow-[0px_4px_6px_-4px_#8ea08733,0px_10px_15px_-3px_#8ea08733] w-full rounded-xl" />
                <div className="relative flex items-center justify-center w-[118.06px] h-6 mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                  Create Account
                </div>
              </button>

              <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto] opacity-60">
                <p className="relative flex items-center justify-center w-[362.58px] h-4 mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-transparent text-xs text-center tracking-[0] leading-3">
                  <span className="text-[#193c1f] leading-4">
                    By registering, you agree to our{" "}
                  </span>
                  <span className="text-[#d1b698] underline cursor-pointer">
                    Terms of Service
                  </span>
                  <span className="text-[#193c1f] leading-4"> and </span>
                  <span className="text-[#d1b698] underline cursor-pointer">
                    Privacy Policy
                  </span>
                  <span className="text-[#193c1f] leading-4">.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="items-center justify-between px-12 py-6 self-stretch flex-[0_0_auto] bg-[#f7f3ed] border-t [border-top-style:solid] border-[#d0d5cb] opacity-60 flex relative w-full">
        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
          <p className="relative flex items-center w-[292.47px] h-4 mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-[#193c1f] text-xs tracking-[0] leading-4 whitespace-nowrap">
            © 2024 CareConnect. Supporting resilience and safety.
          </p>
        </div>

        <nav className="inline-flex items-start gap-8 relative flex-[0_0_auto]">
          {FOOTER_LINKS.map((link) => (
            <div
              key={link.label}
              className="inline-flex flex-col items-start relative self-stretch flex-[0_0_auto]"
            >
              <div
                className={`relative flex items-center ${link.width} h-4 mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-[#193c1f] text-xs tracking-[0] leading-4 whitespace-nowrap cursor-pointer`}
              >
                {link.label}
              </div>
            </div>
          ))}
        </nav>
      </footer>
    </div>
  );
};