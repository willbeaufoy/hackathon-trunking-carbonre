import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-full flex flex-col justify-evenly w-full items-center bg-white dark:bg-gray-900 mx-auto max-w-xs sm:max-w-screen-md text-center">
        <div className="w-32 h-32 relative md:w-48 md:h-48">
          <Image src='/logo.png' alt='logo' fill />
        </div>
      <section className="after:content-['\a0']">
      <h1 className="text-4xl mb-4 font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">ZenFocus</h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Boost productivity with ZenFocus. <br />The Agile Results app that helps you work flexibly and iteratively towards your goals.</p>
      </section>
        <Link href="/sign-up" className="block shadow-xl py-3 w-72 sm:w-96 text-base font-normal text-center text-black rounded-full bg-green-300 hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900">
          Sign up
        </Link>
      <Link href="/sign-in" className="text-base underline after:content-['\a0']">
        I already have an account
      </Link>
    </main>
  )
}