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

const formSchema = z.object({
  pacient: z.string(),
  medic: z.string(),
});

export default function App() {
  const [pacients, setPacients] = useState<User[]>([]);
  const [medics, setMedics] = useState<User[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacient: "",
      medic: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  async function getPacients() {
    const result = await fetch("http://localhost:3333/pacients")

    const data = await result.json()

    if (result.ok) {
      setPacients(data.pacients)
    }
  }

  async function getMedics() {
    const result = await fetch("http://localhost:3333/medics")

    const data = await result.json()

    if (result.ok) {
      setMedics(data.medics)
    }
  }

  useEffect(() => {
    getPacients()
    getMedics()
  }, [])

  return (
    <Card className="w-[350px]">
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
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a data do agendamento" />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
