import React, {useCallback, useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from "../../components/RefactoredSideMenu/SideMenu";
import Button from "../../components/Button/Button"
import styles from './dashboardGeral.module.css';
import ChartBar from "../../components/Chart/ChartBar"
import Kpi from "../../components/KPI/Kpi";
import CheckableList from "../../components/CheckableList/CheckableList";
import {carregarGraficos, carregarKPIs, carregarListasChecaveis} from "./DashGeralFormatter";
import {EnumStatusKpis} from "../../components/KPI/EnumStatusKpis";

const Dashboard = () => {
    // == Constantes
    // Gerais
    const SEM_DADOS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const SUFIXO_SEM_DADOS = " - sem dados"
    const MESES = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
        'Outubro', 'Novembro', 'Dezembro'
    ];

    const [teste, setTeste] = useState([])

    // Dos gráficos
    const TITULO_ENTRADAS_E_SAIDAS = "Entradas e Saídas"
    const TITULO_PERDAS = "Perdas por tipo"
    const TITULO_COMPRAS = "Compras regulares X Compras não planejadas"

    // Dados das CheckableList dos filtros
    let [categorias, setCategorias] = useState([])
    let [produtos, setProdutos] = useState([])

    // === Dados dos gráficos
    // Entradas e saídas
    const [entradasSaidas, setEntradasSaidas] = useState([
        {
            label: 'Entradas',
            data: SEM_DADOS,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        {
            label: 'Saídas',
            data: SEM_DADOS,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }
        ])
    const [tituloEntradasEhSaidas, setTituloEntradasEhSaidas] = useState(TITULO_ENTRADAS_E_SAIDAS)

    // Compras
    const [perdas, setPerdas] = useState([
        {
            label: 'Prazo de validade',
            data: SEM_DADOS,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        {
            label: 'Contaminado ou extraviado',
            data: SEM_DADOS,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'Não se sabe o paradeiro',
            data: SEM_DADOS,
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        }
    ])
    const [tituloPerdas, setTituloPerdas] = useState(TITULO_PERDAS)

    // Compras por categorias
    const [compras, setCompras] = useState([
        {
            label: 'Compras regulares',
            data: SEM_DADOS,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'Compras não planejadas',
            data: SEM_DADOS,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }
    ])
    const [tituloCompras, setTituloCompras] = useState(TITULO_COMPRAS)

    // == Dados das KPIS
    const [kpiPerdas, setKpiPerdas] = useState({"quantidade": null, "status": EnumStatusKpis.NEUTRAL})
    const [kpiNaoPlanejados, setKpiNaoPlanejados] = useState({"quantidade": null, "status": EnumStatusKpis.NEUTRAL})
    const [kpiValorEntradas, setKpiValorEntradas] = useState({"quantidade": null, "status": EnumStatusKpis.NEUTRAL})
    const [kpiValorSaidas, setKpiValorSaidas] = useState({"quantidade": null, "status": EnumStatusKpis.NEUTRAL})

    async function carregarDados(){
        // Listas checáveis
        let dadosListas = await carregarListasChecaveis()
        setCategorias(dadosListas["categorias"])
        setProdutos(dadosListas["produtos"])

        // == Dados de gráficos
        let dadosGraficos = await carregarGraficos()

        // Entradas e saídas
        setEntradasSaidas(dadosGraficos.entradasEhSaidas) // Mudanças de dados
        setTituloEntradasEhSaidas(
            TITULO_ENTRADAS_E_SAIDAS +
            (dadosGraficos.entradasEhSaidas === null ? SUFIXO_SEM_DADOS : "")
        ) // Info de "sem dados" no título

        // Perdas por tipo
        setPerdas(dadosGraficos.perdas)
        setTituloPerdas(TITULO_PERDAS + (dadosGraficos.perdas === null ? SUFIXO_SEM_DADOS : ""))

        // Compras x última hora
        setCompras(dadosGraficos.compras)
        console.log(compras)
        setTituloCompras(
            TITULO_COMPRAS +
            (dadosGraficos.compras === null ? SUFIXO_SEM_DADOS : "")
        )

        let dadosKpis = await carregarKPIs()
        setKpiPerdas(dadosKpis.perdas)
        setKpiNaoPlanejados(dadosKpis.naoPlanejadas)
        setKpiValorEntradas(dadosKpis.valorEntradas)
        setKpiValorSaidas(dadosKpis.valorSaidas)
    }

    /* Realiza animação do ícone e atualiza o texto do hoŕario da última atualização. */
    let atualizando = false
    const [lastUpdateText, setUpdateText] = useState("")
    const [loadingClass, setLoadingClass] = useState(null)
    const atualizarDashboard = useCallback(async () =>{
        // Evita atualizar de novo se já estiver no meio de uma atualização.
        if(atualizando){ return }


        setUpdateText("atualizando...")
        setLoadingClass(styles.loading)
        atualizando = true
        carregarDados().then((d)=>{
            let agora =  new Date()
            let horas = agora.getHours().toString().padStart(2, "0")
            let minutos = agora.getMinutes().toString().padStart(2, "0")
            let horarioFormat = `${horas}:${minutos}`

            setUpdateText(`atualizado pela última vez às ${horarioFormat}`)
            setLoadingClass(null)
            atualizando = false
        })

    }, [])
    useEffect( () => {
        atualizarDashboard().catch(console.error)
        setInterval(atualizarDashboard, 30000) /*Executar à cada 30 seg*/
    }, [atualizarDashboard]); /*Executar 1 vez, no carregamento*/

    return (
        <>
        <Navbar iconHome={"house"} iconEmployees={"users"} exit={"arrow-right-from-bracket"} />
        <div className={styles.group}>
            <div className={styles.Global}>
                <div className={styles.NavTop}>
                    <span className={styles.titulo}>Painel de controle geral</span>
                    <div className={styles.buttons}>
                        <CheckableList textoBase={"Categorias"} opcoes={categorias}/>
                        <CheckableList setTeste={setTeste} teste={teste}
                                       textoBase={"Produtos"} opcoes={produtos}/>
                        <Button insideText={"Alterar período"} />
                    </div>
                </div>
                <div className={styles.Charts}>
                    <ChartBar
                        labels={MESES}
                        datasets={entradasSaidas}
                        title={tituloEntradasEhSaidas}
                        width="34vw"
                        height="250px"
                        backgroundColor="#f0f0f0"
                        yLabel={"Valor em reais (R$)"}
                    />
                    <ChartBar
                        labels={MESES}
                        datasets={perdas}
                        title={tituloPerdas}
                        width="34vw"
                        height="250px"
                        backgroundColor="#f0f0f0"
                        yLabel={"Quantidade de perdas"}
                    />
                    {teste?.map((item) => {
                        return (<h1>{item.nome} {item.selecionado}</h1>)
                    })}
                    <ChartBar
                        labels={MESES}
                        datasets={compras}
                        title={tituloCompras}
                        width="100vw"
                        height="220px"
                        backgroundColor="#f0f0f0"
                        margin="auto"
                        alignItems="center"
                    />
                </div>
            </div>
            <div className={styles.SideMenu}>
                <div onClick={()=> atualizarDashboard()} className={styles.updateInfo + " " + loadingClass}>
                    <h3>Dados em tempo real</h3>
                    <span>
                        <FontAwesomeIcon icon={"clock-rotate-left"} className={styles.staticIcon}/>
                        <FontAwesomeIcon icon={"rotate"} className={styles.loadingIcon}/>
                        <p>{lastUpdateText}</p>
                    </span>
                </div>
                <div className={styles.DivKpis}>
                    <h3>Informes desse período</h3>
                    <div>
                        <Kpi type={"simples"} name={"Perdas"} value={kpiPerdas.quantidade} status={kpiPerdas.status}/>
                        <Kpi
                            type={"simples"} name={"Quantidade de compras não planejadas"}
                            value={kpiNaoPlanejados.quantidade} status={kpiNaoPlanejados.status}
                        />
                        <Kpi
                            type={"monetária"} name={"Valor total das entradas"} value={kpiValorEntradas.quantidade}
                            status={kpiValorEntradas.status}
                        />
                        <Kpi
                            type={"monetária"} name={"Valor total das saídas"} value={kpiValorSaidas.quantidade}
                            status={kpiValorSaidas.status}
                        />
                    </div>
                </div>
            </div>
        </div>
            </>
    );
}

export default Dashboard;