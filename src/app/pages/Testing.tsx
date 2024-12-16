import { TableColumn } from "@dynatrace/strato-components-preview";

const column: TableColumn[] = [
  {
    id: 'first columnn',
    header: 'First Column',
    accessor: 'first',
    cell: row => row.value.toUpperCase(),
  },
  {
    id: 'second column',
    header: 'Second Column',
    accessor: 'second',
    cell: row => row.value.toUpperCase(),
  }
]

const data = [
  {
    first: "1st row 1st column",
    second: "1st row 2nd Data"
  },
  {
    first: "2ns row 1st column",
    second: "2nd row 2nd Data"
  }
]