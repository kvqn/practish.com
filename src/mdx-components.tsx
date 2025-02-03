import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-6 text-xl font-bold">{children}</h1>
    ),
    p: ({ children }) => <p className="my-2">{children}</p>,
    pre: ({ children }) => (
      <pre className="group relative m-4 overflow-hidden rounded-md bg-neutral-800 p-4 text-white">
        {children}
      </pre>
    ),
    code: ({ children, className }) => {
      const language = className?.replace("language-", "")
      return (
        <>
          <p className="absolute right-0 top-0 rounded-bl-md bg-neutral-600 p-1 text-sm opacity-0 group-hover:opacity-100">
            {language}
          </p>
          <code>{children}</code>
        </>
      )
    },
    ...components,
  }
}
