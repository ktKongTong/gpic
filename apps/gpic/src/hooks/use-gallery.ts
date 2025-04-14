import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/query";
import {api} from "@/lib/api";

type Image = {
  id: number,
  url: string,
  description?: string,
  style?: string,
  originImageURL?: string,
}
const emptyArr: never[] = []

export const useGallery = () => {

  const {data, isLoading, error} = useQuery({
    queryKey: queryKeys.gallery,
    queryFn: () => api.getGallery()
  })

  const images = data ?? emptyArr
  return {
    isLoading,
    error,
    images
  }
}