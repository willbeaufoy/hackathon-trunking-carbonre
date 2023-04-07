import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-sm sm:max-w-screen-xl text-center lg:py-16">
          <h1 className="mt-14 mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">ZenFocus</h1>
          <p className="mb-14 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Boost your productivity and achieve your goals with ZenFocus - the Agile Results app designed to help you work in a flexible and iterative way.</p>
          <div className='w-full flex justify-center mb-14'>
            <div className="w-32 h-32 relative md:w-48 md:h-48">
              <Image src='/logo.png' alt='logo' fill />
            </div>
          </div>
          <div className="flex flex-col space-y-4 mb-14 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <a href="#" className="inline-flex justify-center shadow-xl items-center py-3 px-5 sm:w-96 text-base font-normal text-center text-black rounded-full bg-green-300 hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900">
              Sign up
            </a>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <a href='#' className='text-base underline'>
            {/* <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"> */}
              I have already an account
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}