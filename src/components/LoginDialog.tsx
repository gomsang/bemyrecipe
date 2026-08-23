import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { login, logout, register } from "../lib/firebase";

type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (mode === "register") {
        await register(email.trim(), password);
        setNotice("확인 메일을 보냈습니다. 이메일 인증 후 로그인하세요.");
        setMode("login");
        setPassword("");
      } else {
        const credential = await login(email.trim(), password);
        if (!credential.user.emailVerified) {
          await logout();
          setError("이메일 인증을 마친 뒤 로그인하세요.");
          return;
        }
        onOpenChange(false);
        setPassword("");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "로그인할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-kicker">PRIVATE ACCESS</div>
          <Dialog.Title>{mode === "login" ? "내 레시피 보관함" : "계정 만들기"}</Dialog.Title>
          <Dialog.Description>{mode === "login" ? "등록된 이메일과 비밀번호를 입력하세요." : "이메일 인증을 마치면 개인 공간을 사용할 수 있습니다."}</Dialog.Description>
          <form className="login-form" onSubmit={submit}>
            <label>
              <span>이메일</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label>
              <span>비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {notice ? <p className="form-notice">{notice}</p> : null}
            <button className="primary-button" disabled={loading}>
              {loading ? <LoaderCircle className="spin" size={16} /> : null}
              {mode === "login" ? "로그인" : "계정 만들기"}
            </button>
            <button className="text-button" type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }}>
              {mode === "login" ? "처음이라면 계정 만들기" : "이미 계정이 있다면 로그인"}
            </button>
          </form>
          <Dialog.Close className="icon-button dialog-close" aria-label="닫기">
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
