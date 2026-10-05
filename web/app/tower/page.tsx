import type { Metadata } from "next";
import { TowerGame } from "@/components/tower/tower-game";

export const metadata: Metadata = {
  title: "Башня Сююмбике — игра",
  description: "Сюжетная игра-головоломка: поднимитесь на вершину башни Сююмбике, разгадывая загадки на татарском языке.",
};

export default function TowerPage() {
  return <TowerGame />;
}
