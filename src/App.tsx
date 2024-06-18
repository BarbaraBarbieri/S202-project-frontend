import "./App.css";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "./components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { useEffect, useState } from "react";
import { CalendarIcon, Edit3Icon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "./lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";

export interface User {
  _id: string
  email: string
  password: string
  name: string
  socialName?: string
  rg: string
  cpf: string
  gender: string
  birthDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  medicName: string
  pacientName: string
  date: Date
  status?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const formSchema = z.object({
  pacient: z.string(),
  medic: z.string(),
  date: z.date(),
});

const formModalSchema = z.object({
  pacientModal: z.string(),
  medicModal: z.string(),
  dateModal: z.date(),
});

export default function App() {
  const [pacients, setPacients] = useState<User[]>([]);
  const [medics, setMedics] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  function handleSelectedAppointment(appointment: Appointment) {
    return () => {
      setSelectedAppointment(appointment);
    };
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacient: "",
      medic: "",
    },
  });

  const formModal = useForm<z.infer<typeof formModalSchema>>({
    resolver: zodResolver(formModalSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createAppointment()
    getAppointments()
  }

  function onSubmitModal(values: z.infer<typeof formModalSchema>) {
    const appointmentId = selectedAppointment?.id || ""
    console.log(values, appointmentId)
    updateAppointment(appointmentId)
    getAppointments()
  }

  async function getPacients() {
    const result = await fetch("https://s202-project-backend.onrender.com/pacients")

    const data = await result.json()

    if (result.ok) {
      setPacients(data.pacients)
    }
  }

  async function getMedics() {
    const result = await fetch("https://s202-project-backend.onrender.com/medics")

    const data = await result.json()

    if (result.ok) {
      setMedics(data.medics)
    }
  }

  async function getAppointments() {
    const result = await fetch("https://s202-project-backend.onrender.com/appointments")

    const data = await result.json()

    if (result.ok) {
      setAppointments(data.appointments)
    }
  }

  async function createAppointment() {
    const result = await fetch("https://s202-project-backend.onrender.com/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pacientId: form.getValues("pacient"),
        medicId: form.getValues("medic"),
        date: form.getValues("date")
      })
    })

    if (result.ok) {
      console.log("Agendamento criado com sucesso!")
      getAppointments()
    }
  }

  async function updateAppointment(id: string) {
    const result = await fetch("https://s202-project-backend.onrender.com/appointment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        pacientId: formModal.getValues("pacientModal"),
        medicId: formModal.getValues("medicModal"),
        date: formModal.getValues("dateModal")
      })
    })

    if (result.ok) {
      console.log("Agendamento atualizado com sucesso!")
      getAppointments()
    }
  }

  async function deleteAppointment(id: string) {
    const result = await fetch(`https://s202-project-backend.onrender.com/appointment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    })

    if (result.ok) {
      console.log("Agendamento deletado com sucesso!")
    }
  }

  function handleDeleteAppointment(id: string) {
    return async () => {
      await deleteAppointment(id);
      getAppointments();
    };
  }

  useEffect(() => {
    getPacients()
    getMedics()
    getAppointments()
  }, [])

  return (
    <div className="flex flex-col space-x-5 md:flex-row md:space-y-5 items-center md:items-start">
      <Card className="w-[550px]">
        <CardHeader className="items-center">
          <CardTitle>Criar novo agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
              <FormField
                control={form.control}
                name="pacient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pacients.map((pacient: User) => {
                          return (
                            <SelectItem key={pacient._id} value={pacient._id}>
                              {pacient.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um médico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medics.map((medic: User) => {
                          return (
                            <SelectItem key={medic._id} value={medic._id}>
                              {medic.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Defina a data do agendamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Table>
        <TableCaption>{appointments.length ? "Agendamentos recentes" : "Nenhum agendamento recente encontrado"}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data do Agendamento</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment: Appointment) => {
            return (
              <TableRow key={appointment.id}>
                <TableCell>{format(appointment.date, "PPP", { locale: ptBR })}</TableCell>
                <TableCell>{appointment.medicName}</TableCell>
                <TableCell>{appointment.pacientName}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleSelectedAppointment(appointment)}>
                        <Edit3Icon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar consulta</DialogTitle>
                        <DialogDescription>
                          Faça as mudanças na sua consulta aqui. Clique em salvar quando terminar.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...formModal}>
                        <form onSubmit={formModal.handleSubmit(onSubmitModal)} className="space-y-8 flex flex-col">
                          <FormField
                            control={formModal.control}
                            name="pacientModal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Paciente</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um paciente" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="z-50">
                                    {pacients.map((pacient: User) => {
                                      return (
                                        <SelectItem key={pacient._id} value={pacient._id}>
                                          {pacient.name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formModal.control}
                            name="medicModal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Médico</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um médico" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {medics.map((medic: User) => {
                                      return (
                                        <SelectItem key={medic._id} value={medic._id}>
                                          {medic.name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formModal.control}
                            name="dateModal"
                            render={({ field }) => (
                              <FormItem className="flex flex-col z-50">
                                <FormLabel>Defina a data do agendamento</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP", { locale: ptBR })
                                        ) : (
                                          <span>Escolha a data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date: Date) =>
                                        date < new Date()
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogTrigger asChild>
                            <Button type="submit">Salvar alterações</Button>
                          </DialogTrigger>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={handleDeleteAppointment(appointment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
