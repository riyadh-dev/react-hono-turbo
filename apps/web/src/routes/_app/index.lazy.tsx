import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/')({
	component: HomeComponent,
})

function HomeComponent() {
	return (
		<main className='relative min-h-screen content-center bg-white'>
			<h1 className='bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-600 bg-clip-text pb-16 text-center text-7xl font-extrabold tracking-tight text-transparent'>
				REACT HONO TURBO
			</h1>
			<div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
				<div className='mt-6 flex flex-wrap justify-center gap-8'>
					{[
						{
							src: 'https://user-images.githubusercontent.com/1500684/158238105-e7279a0c-1640-40db-86b0-3d3a10aab824.svg',
							alt: 'PostgreSQL',
							href: 'https://www.postgresql.org/',
						},
						{
							src: 'https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg',
							alt: 'Prisma',
							href: 'https://prisma.io',
						},
						{
							src: 'https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg',
							alt: 'Tailwind',
							href: 'https://tailwindcss.com',
						},
						{
							src: 'https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg',
							alt: 'Prettier',
							href: 'https://prettier.io',
						},
						{
							src: 'https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg',
							alt: 'ESLint',
							href: 'https://eslint.org',
						},
						{
							src: 'https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg',
							alt: 'TypeScript',
							href: 'https://typescriptlang.org',
						},
					].map((img) => (
						<a
							key={img.href}
							href={img.href}
							className='flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0'
						>
							<img
								alt={img.alt}
								src={img.src}
								className='object-contain'
							/>
						</a>
					))}
				</div>
			</div>
		</main>
	)
}
