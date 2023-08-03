"use client";
import { useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'

export default function Home() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [bill, setBill] = useState(getRandomInt(0, 100))
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      // Display a preview of the selected image
      setBill(getRandomInt(0, 100))
      setIsLoading(true)
      setResult(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target.result)
      }
      reader.readAsDataURL(file)

      // Load the pre-trained MobileNet model
      const model = await mobilenet.load()

      // Create an image element to display the selected file
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      img.onload = async () => {
        // Convert the image to a tensor
        const imgTensor = tf.browser.fromPixels(img)

        // Classify the image using the model
        const predictions = await model.classify(imgTensor)

        // Display the top prediction
        setResult(predictions[0].className.split(',')[0])

        // Remove the img element from the DOM
        img.remove()

        setIsLoading(false)
      }
    }
  }

  return (
    <div className="p-4">
      <label className="btn btn-primary">
        <span>Select an image</span>
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>
      {isLoading && (
        <div className="flex ml-[50px] mt-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {image && !isLoading && (
        <div>
          <h2 className="text-lg font-bold mb-2 mt-4">Preview:</h2>
          <img src={image} alt="Preview" className="rounded-md shadow-md" />
        </div>
      )}
      {result && !isLoading && (
        <div>
          <h2 className="text-lg font-bold mb-2 mt-4">Result:</h2>
          <p className="text-gray-700">{result}Lawg</p>
          <p className="text-gray-700">Lawg bills: {bill}$</p>
          <button className="btn mt-2 btn-error" onClick={() => window.my_modal_1.showModal()}>pay lawg bills</button>
          <dialog id="my_modal_1" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">well .... your card got declined!!</h3>
              <p className="py-4">The bill collector is coming after you💀💀</p>
              <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">run</button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </div>
  )
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
