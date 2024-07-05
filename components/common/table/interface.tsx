interface Action {
  label: string;
  onClick: (data: any) => void;
  style?: string;
}

interface MainAction {
  label: string;
  onClick: () => void;
}

type RenderFunction = (data: any) => React.ReactNode;

interface Heading {
  title: string;
  dataKey: string;
  render?: RenderFunction;
}

interface TableProps {
  data: Array<Record<string, any>>;
  itemsPerPage: number;
  actions?: Action[];
  mainActions?: MainAction[];
  csvExport?: boolean;
  fullCsv?: boolean;
  csvFileName?: string;
  headings: Heading[];
  striped?: boolean;
  bordered?: boolean;
  hovered?: boolean;
  hscroll?: boolean;
  filterable?: boolean;
}
