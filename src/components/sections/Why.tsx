import { Img } from "@/components/ui/Img";
import { IMG } from "@/content/images";
import { site } from "@/content/site";
import { LogoMark } from "@/components/brand/Logo";

// A plate styled like the paint-code label in a car's door jamb.
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1];

export function Why() {
  const w = site.why;
  return (
    <section id="why" className="section border-t border-line" aria-labelledby="why-title">
      <div className="wrap relative grid gap-0 lg:grid-cols-12">
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <div className="relative aspect-[3/2] overflow-hidden notch" data-parallax="6">
            <Img src={IMG.craft} alt={w.imageAlt} sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>
        </div>

        <div className="relative z-10 -mt-12 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:mt-24">
          <div className="plate notch" data-reveal="plate">
            <div className="flex items-center justify-between gap-6 border-b border-line-strong px-6 py-5">
              <div className="flex items-center gap-3">
                <LogoMark className="h-7 w-auto text-paper" />
                <h2 id="why-title" className="display text-[1.05rem] leading-tight sm:text-[1.25rem]">
                  {w.title}
                </h2>
              </div>
              <div className="barcode hidden sm:flex" aria-hidden="true">
                {BARS.map((b, i) => (
                  <i key={i} style={{ width: b }} />
                ))}
              </div>
            </div>
            {w.rows.map((r) => (
              <div key={r.label} className="plate-row" data-plate-row>
                <p className="label steel pt-1">{r.label}</p>
                <div>
                  <p className="text-title font-semibold">{r.title}</p>
                  <p className="steel mt-1.5">{r.text}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-line-strong px-6 py-3">
              <span className="label steel" aria-hidden="true">PIR · <span className="num">130</span> · RJP · <span className="num">110008</span></span>
              <span className="marker" aria-hidden="true">
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
