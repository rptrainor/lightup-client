import { createSignal, createResource, Suspense } from "solid-js";

async function postFormData(formData: FormData) {
  const response = await fetch("/api/create-price", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}

export default function Form() {
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);

  function submit(e: SubmitEvent) {
    setFormData(new FormData(e.target as HTMLFormElement));
  }

  return (
    <div>
      <label>
        Name
        <input value={42} type="number" id="amountValue" name="amountValue" required />
      </label>
      <label>
        Email
        <input type="email" id="email" name="email" required />
        </label>
      <button>Send</button>
      <Suspense>{response() && <p>{response()}</p>}</Suspense>
    </div>
  );
}