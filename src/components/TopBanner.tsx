// Thin site-wide announcement bar linking to our sister company, TagEasy.
export default function TopBanner() {
  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-2 text-center text-[13px]">
        <span className="text-[#cdd6e2]">Need tagging &amp; analytics done right?</span>
        <a
          href="https://tageasy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline decoration-teal decoration-2 underline-offset-2 hover:text-teal"
        >
          Meet TagEasy, our sister company →
        </a>
      </div>
    </div>
  );
}
