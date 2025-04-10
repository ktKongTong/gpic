import Header from "@/app/v2/header";
import Form from "@/app/v2/form";

export default function Page() {


  return <>
    <Header/>
    <div className={'grid md:grid-cols-3 grid-rows-4 gap-2 w-full items-center grow  justify-stretch p-2 sm:p-4 md:p-10'}>
      <div className={'grow content-stretch md:col-span-2 md:row-span-full self-stretch justify-items-stretch'}>
        <Form/>
      </div>
      <div className={'grow md:col-span-1 row-span-2 self-stretch'}>
        price
        {/*<Form/>*/}
      </div>
      {

    }

    </div>

  </>
}