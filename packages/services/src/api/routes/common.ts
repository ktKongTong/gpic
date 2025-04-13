import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {i18nCode} from "../shared";

const app = new Hono()
app.get('/style', async (c) => {
  const  {styleService} = getService(c)
  const res = await styleService
    .getStyles(i18nCode.EN)
  return c.json(res)
})


const images = [
  {
    id: 0,
    url:"https://picit-usercontent.ktlab.io/ai_01jr7bg18efzr807mcwm1enxt3",
  },
  {
    id: 1,
    url:"https://picit-usercontent.ktlab.io/ai_01jqycgqerfvk9vh3fdn9r2ba2",
  },
  {
    id: 2,
    url:"https://picit-usercontent.ktlab.io/ai_01jr023ztyexxrx17ehn37ghnh",
  },
  {
    id: 3,
    url:"https://picit-usercontent.ktlab.io/ai_01jqycd2gqfvk9vh0amjxrsjsk",
  },
  {
    id: 4,
    url:"https://picit-usercontent.ktlab.io/ai_01jqxx4ybqfamsr8gk952gz0qh",
  },
  {
    id: 5,
    url: "https://picit-usercontent.ktlab.io/ai_01jqqyvvgxe8m9zgwdtn8zeyq8",
  },
  {
    id: 6,
    url: "https://picit-usercontent.ktlab.io/ai_01jqqrzh5xe8k8g5jv9d03nfbt",
  },
  {
    id: 7,
    url: "https://picit-usercontent.ktlab.io/ai_0195edfa-8526-714a-9044-f422ebc393ec",
  },
  {
    id: 8,
    url: "https://picit-usercontent.ktlab.io/ai_0195ec59-1946-7240-81a2-4a25c77d0f97",
  },
  {
    id: 9,
    url: "https://picit-usercontent.ktlab.io/ai_0195ec44-8284-773b-b245-de40fc7088a4",
  },
  {
    id: 10,
    url: "https://picit-usercontent.ktlab.io/ai_0195eba9-4a8a-764d-9967-0e49c8e618a6",
  },
  {
    id: 11,
    url: "https://picit-usercontent.ktlab.io/ai_0195ebcb-4f87-754c-b1a1-c6c4d6517263",
  },
  {
    id: 12,
    url: "https://picit-usercontent.ktlab.io/ai_0195eb9a-1ecb-7518-ac6b-bfb4b5595418",
  },
  {
    id: 13,
    url: "https://picit-usercontent.ktlab.io/ai_0195eb92-5349-77ed-992c-31863f1b2c54",
  },
  {
    id: 14,
    url: "https://picit-usercontent.ktlab.io/ai-0195db57-1105-76ba-90d1-e1d4497f7ac3",
  },
  {
    id: 15,
    url: "https://picit-usercontent.ktlab.io/ai_01jqr3ntqre488qsxsm68s9592",
  },
  {
    id: 16,
    url: "https://picit-usercontent.ktlab.io/ai_01jqremqdef20tpyf4hh9b5ct5",
  },
  {
    id: 17,
    url: "https://picit-usercontent.ktlab.io/ai_01jqqs3dt6e8k8g5kd5py21mhc",
  },
  {
    id: 18,
    url: "https://picit-usercontent.ktlab.io/ai_0195eba3-f88d-705f-86eb-1d44b385ee47",
  }
  //
  //
  //
]



app.get('/gallery', async (c) => {
  return c.json(images)
})

export { app as commonRoute }