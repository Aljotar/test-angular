import { TotsTableDefaultConfig } from "@tots/table";
import { CustomLoadingComponent } from "../components/custom-loading/custom-loading.component";

export const totsTableDefaultConfig : TotsTableDefaultConfig = {
  messageNotFound: "Mensaje personalizado. No hay elementos",
  loadingComponent: CustomLoadingComponent,
  matColor: "warn",
  lowerPaginator: false,
  lowerProgressBar: false,
}