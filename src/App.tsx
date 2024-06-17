// import axios from 'axios'
import './App.css'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function App() {

  const consultas = [
    {
      id: "1",
      date: "01/01/2024 15:30",
      specialty: "Cardiologia",
      doctor: "Dr. Fulano",
      patient: "Beltrano",
    },
    {
      id: "2",
      date: "01/01/2024 15:30",
      specialty: "Cardiologia",
      doctor: "Dr. Fulano",
      patient: "Beltrano",
    },
    {
      id: "3",
      date: "01/01/2024 15:30",
      specialty: "Cardiologia",
      doctor: "Dr. Fulano",
      patient: "Beltrano",
    },
    {
      id: "4",
      date: "01/01/2024 15:30",
      specialty: "Cardiologia",
      doctor: "Dr. Fulano",
      patient: "Beltrano",
    },   
  ]

  return (
    <div className="flex flex-row gap-10">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Agendar Consulta</CardTitle>
          <CardDescription>Agende sua consulta com poucos cliques.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col items-start space-y-1.5">
                <Label htmlFor="name">Especialidade</Label>
                <Input id="name" placeholder="Nome da especialidade..." />
              </div>
              <div className="flex flex-col items-start space-y-1.5">
                <Label htmlFor="name">Médico(a)</Label>
                <Input id="name" placeholder="Nome da médico(a)..." />
              </div>
              <div className="flex flex-col items-start space-y-1.5">
                <Label htmlFor="framework">Data e horário</Label>
                <Input id="name" placeholder="DD/MM/AAAA hh:mm" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button>Agendar</Button>
        </CardFooter>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data e horário</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Médico(a)</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultas.map((consulta) => (
            <TableRow key={consulta.id}>
              <TableCell>{consulta.date}</TableCell>
              <TableCell>{consulta.specialty}</TableCell>
              <TableCell>{consulta.doctor}</TableCell>
              <TableCell>{consulta.patient}</TableCell>
              <TableCell>Editar / Deletar</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default App
