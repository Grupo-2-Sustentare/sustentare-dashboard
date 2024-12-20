import styles from "./login.module.css";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate para redirecionamento de rotas
import React, {useState} from "react"; // Importa React e o hook useState para gerenciamento de estado
import Button from "../../components/Button/Button";
import TextInput from "../../components/TextInput/TextInput";
import { errorToast} from "../../components/Toast/Toast";
import login from "./LoginFormatter";

const Login = () => {

    const navigate = useNavigate(); // Inicializa o hook de navegação
    const [nome, setNome] = useState(""); // Estado para armazenar o ano da música
    const [senha, setSenha] = useState(""); // Estado para armazenar o gênero da música

    async function logar() {
        if (nome === "" || senha === ""){
            errorToast("Preencha todos os campos.")
            return
        }
        let res = await login({"nome": nome, "senha": senha})
        if (res !== undefined){
            delete res["senha"]
            sessionStorage.setItem("usuario", JSON.stringify(res))
            navigate("/dashboardGeral"); // Redireciona para a página de músicas
        }
    }

    return (
        <div className={styles.login}>
            <h1>Paralelo 19</h1>
            <form>
                <TextInput label={"Nome:"} value={nome} getValue={setNome} tabIndex={1}/>
                <TextInput
                    label={"Senha:"} value={senha} type="password" getValue={setSenha} tabIndex={2} onEnter={logar}
                />
            </form>
            <Button insideText="Entrar" onClick={logar} tabIndex={3}/>
        </div>

    );
};

export default Login;