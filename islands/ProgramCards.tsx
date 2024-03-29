/** @jsx h */
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Program } from "../types/Program.ts";
import ProgramCardMemo from "../islands/ProgramCard.tsx";
import ProgramCardCompact from "./ProgramCardCompact.tsx";

const getClaps = async () => {
  const claps = await fetch(
    "https://www3.yoslab.net/~nishimura/yoslab-radio/getClaps.php",
  );
  const clapsJson: Clap[] = await claps.json(); // 降ってくるJSONが全部stringになってる...
  const clapsWithType = clapsJson.map((clap) => {
    return { id: Number(clap.id), count: Number(clap.count) };
  });
  return clapsWithType;
};

type Clap = { id: number; count: number };

const ProgramCards = (props: { programs: Program[]; isCompact: boolean }) => {
  const [claps, setClaps] = useState<Clap[]>([]);

  useEffect(() => {
    const inner = async () => {
      const newClaps = await getClaps();
      setClaps(newClaps);
    };
    inner();

    setInterval(async () => {
      const newClaps = await getClaps();
      setClaps(newClaps);
    }, 2000);
  }, []);

  const handleOnClick = useCallback(async (id: number) => {
    setClaps((prevClaps) =>
      prevClaps.map((clap) =>
        clap.id == id
          ? { id: clap.id, count: Number(clap.count) + 1 }
          : { id: clap.id, count: Number(clap.count) }
      )
    );
    await fetch(
      "https://www3.yoslab.net/~nishimura/yoslab-radio/updateClap.php",
      {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }, []);

  return (
    <div>
      {props.programs.map((program) => {
        const clapsCount = claps.find((v) => v.id == program.id)?.count || 0;
        {
          return !props.isCompact
            ? (
              <ProgramCardMemo
                {...program}
                isTransition={true}
                clap={clapsCount}
                handleOnClick={handleOnClick}
              />
            )
            : (
              <ProgramCardCompact
                program={program}
                clap={clapsCount}
                handleOnClick={handleOnClick}
              />
            );
        }
      })}
    </div>
  );
};

ProgramCards.defaultProps = {
  isCompact: false,
};

export default ProgramCards;
