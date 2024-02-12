import { useForm } from 'react-hook-form'
import {createTask, deleteTask, updateTask, getTask} from '../api/task.api'
import {useNavigate, useParams} from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export function TaskFormPage() {
  const { register, handleSubmit, formState:{
    errors
  }, setValue } = useForm()
  const navigate = useNavigate()
  const params = useParams()
  console.log(params)

  const onSubmit = handleSubmit(async data=>{
    if(params.id){
      updateTask(params.id, data)
      console.log('Editando')
    } else{
      await createTask(data)
      toast.success('Tarea creada')
    }
    navigate('/task')
  })  

  useEffect(()=>{
    async function loadTask(){      
      if(params.id){
        console.log('obteniendo datos')
        const {data} = await getTask(params.id)
        setValue('title', data.title)
        setValue('description', data.description)        
      }
    }
    loadTask()
  },[])

  return (
    <div className="max-w-xl mx-auto">
      <form action="" onSubmit={onSubmit} className="bg-zinc-800 p-10 rounded-lg mt-2" >
        <input type="text" placeholder='Titulo' {...register('title', {required:true})} className="bg-zinc-700 p-3 rounded-lg block w-full mb-3" autoFocus />
        {errors.title && <span>Este campo es requerido</span>}
        <textarea rows="4" placeholder='Descripcion' {...register('description', {required:true})} className="bg-zinc-700 p-3 rounded-lg block w-full"></textarea>
        {errors.description && <span>Este campo es requerido</span>}
        <button className="bg-indigo-500 p-3 rounded-lg block w-full mt-3">Save</button>
      </form>
      {
        params.id && <div className="flex justify-end">
          <button
          className="bg-red-500 p-3 rounded-lg w-48 mt-3"
          onClick={async()=>{
            const accepted = window.confirm('Esta seguro')
            if(accepted){
              await deleteTask(params.id)
              toast.success('Tarea eliminada')
              navigate('/task')
            }
          }}
          >
            Delete
          </button>
        </div>
        // params.id && <button onClick={async()=>{
        //   const accepted = window.confirm('Esta seguro')
        //   if(accepted) {
        //     await deleteTask(params.id)
        //     navigate('/task')
        //   }
        // }} >Delete</button>
      }
    </div>
  )
}
  