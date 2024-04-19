import { get, ref } from "firebase/database";
import { database } from "../db/db";
import {useEffect, useState } from "react";
import axios from "axios";
import { GamesProps } from "../interface/interfaceGame";
import { TitulosH1 } from "./Titulos";
import { Clock } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { remover } from "../utils/Funcoes";

export const FavoriteGames = () => {
  const [ids, setIdsFavoritos] = useState<GamesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDivId, setHoveredDivId] = useState<number | null>(null);


  useEffect(() => {
    async function getIdGames() {
      const user = localStorage.getItem("user")!;
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.id;
      const usuariosRef = ref(database, "usuarios/" + userId + "/favoritos");
      try {
        const snapshot = await get(usuariosRef);
        if (snapshot.exists()) {
          const favoriteIds = snapshot.val();
          const fetchedGames = [];

          // Faz uma solicitação para cada ID de jogo favorito
          for (const id of favoriteIds) {
            const options = {
              method: "GET",
              url: `https://gamerpower.p.rapidapi.com/api/giveaway`,
              params: { id: id },
              headers: {
                "X-RapidAPI-Key":
                  "7f5ed69f57msh56242f71d3966fbp11c1d2jsnd0c316423ce1",
                "X-RapidAPI-Host": "gamerpower.p.rapidapi.com",
              },
            };
            try {
              const response = await axios.request(options);
              fetchedGames.push(response.data);
            } catch (error) {
              console.error(error);
            }
          }

          // Atualiza o estado com os dados dos jogos favoritos
          setIdsFavoritos(fetchedGames);
        }
      } catch (error) {
        console.error("Erro ao buscar favoritos do usuário:", error);
      } finally {
        setLoading(false); // aqui termina o arequisicao entao recebe false
      }
    }

    getIdGames();
  }, []);

  const navigate = useNavigate();

  



  return (
    <div className="p-5 relative min-h-screen h-screen ">
      <div onClick={() => navigate("/")} className="cursor-pointer py-2">
        <div className="flex items-center ">
          <Icon icon="typcn:arrow-back" style={{ fontSize: "40px" }} />
          <span className="text-xl">VOLTAR</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-start h-4/5  gap-7 pt-2 ">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Icon
              className="animate-spin"
              icon="lucide:loader-circle"
              style={{ fontSize: "50px" }}
            />
          </div>
        ) : ids.length === 0 ? (
          <div className="flex flex-col justify-center items-center w-full">
            <Icon
              icon="carbon:warning-square-filled"
              style={{ fontSize: "70px" }}
              className="text-zinc-200"
            />
            <strong>Nenhum Favorito</strong>
          </div>
        ) : (
          ids.map((game) => (
            <div key={game.id} className="flex justify-center items-center">
              <div
                onMouseOver={() => setHoveredDivId(game.id)}
                onMouseLeave={() => setHoveredDivId(null)}
                className="relative h-auto w-56 place-self-start justify-self-start bg-zinc-700 rounded-md text-center shadow-md cursor-pointer hover:scale-105 duration-300 overflow-hidden whitespace-nowrap"
                key={game.id}
              >
                {hoveredDivId === game.id && (
                  <div className="absolute top-2 right-2 text-zinc-50">
                    <Icon
                    onClick={() => remover(game).then(() => window.location.reload()).catch((e) => console.log(e)
                    )}

                   
                    icon="fluent:delete-dismiss-20-filled"
                      style={{ fontSize: "2em" }}
                    />
                  </div>
                )}

                <img className="w-full h-28" src={game.thumbnail} alt="" />
                <TitulosH1>{game.title}</TitulosH1>
                <p className="px-6 truncate font-semibold">{game.platforms}</p>
                <div className="flex items-center justify-center gap-3 my-5">
                  <strong className="border border-green-800 p-0.5 text-sm rounded bg-green-800 tracking-widest">
                    FREE
                  </strong>
                  <p className="line-through font-medium">{game.worth}</p>
                </div>
                <div className="flex justify-center items-center gap-1 pb-3">
                  <Clock className="text-red-600 size-5" />
                  <p className="capitalize text-sm font-bold">
                    {dayjs().from(dayjs(game.end_date), true)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
