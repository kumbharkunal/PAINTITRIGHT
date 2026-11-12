import { site } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProcessStage } from "./ProcessStage";

// "Seven passes": without JavaScript (and under reduced motion) this is a plain numbered
// list beside the finished cross-section. The motion runtime pins it and scrubs the stage
// through each pass (src/lib/runtime.ts › process).
export function Process() {
  const p = site.process;
  return (
    <section id="process" className="process section border-t border-line" aria-labelledby="process-title" data-scene="process">
      <div className="wrap">
        <SectionTitle id="process-title" className="max-w-4xl">
          {p.title}
        </SectionTitle>
      </div>
      <div className="process-pin wrap mt-12 lg:mt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="process-meta mb-8 items-center gap-5" aria-hidden="true">
              <span className="num text-display-l font-extrabold leading-none text-signal">
                <span className="odo">
                  <span className="odo-col" data-p="odo">
                    {p.steps.map((_, i) => (
                      <span key={i}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
              <span className="process-ticks">
                {p.steps.map((_, i) => (
                  <i key={i} data-tick={i}>
                    <b />
                  </i>
                ))}
              </span>
            </div>
            <ol className="process-steps">
              {p.steps.map((s, i) => (
                <li key={s.title} data-step={i}>
                  <p className="label steel">
                    Pass <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <h3 className="display text-display-l mt-2">{s.title}</h3>
                  <p className="steel mt-3 max-w-md">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="notch border border-line bg-booth-2 p-4 sm:p-6" data-reveal="clip">
              <ProcessStage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
