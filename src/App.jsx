import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient'

function App() {
    const [showProtocol, setShowProtocol] = useState(false)
    const [submitStatus, setSubmitStatus] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
      twitter: '',
      wallet: '',
    })

    const handleInputChange = (e) => {
      const { name, value } = e.target

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleProtocolSubmit = async (e) => {
      e.preventDefault()
    
      const twitter = formData.twitter.trim()
      const wallet = formData.wallet.trim()
    
      setSubmitStatus('')
    
      if (!twitter || !wallet) {
        setSubmitStatus('Please complete all fields.')
        return
      }
    
      if (!/^@[A-Za-z0-9_]{1,15}$/.test(twitter)) {
        setSubmitStatus('Invalid X handle.')
        return
      }
    
      if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
        setSubmitStatus('Invalid EVM wallet address.')
        return
      }
    
      try {
        setIsSubmitting(true)
    
        // =========================
        // CHECK DUPLICATE VIA RPC
        // =========================
        const { data: duplicateCheck, error: duplicateError } =
          await supabase.rpc('check_uol_registration', {
            p_username: twitter,
            p_wallet: wallet,
          })
    
        if (duplicateError) {
          console.error(
            'Duplicate check error:',
            duplicateError
          )
    
          setSubmitStatus(
            'Unable to verify registration. Please try again.'
          )
    
          return
        }
    
        const result = duplicateCheck?.[0]
    
        if (result?.username_exists) {
          setSubmitStatus(
            'This X handle is already registered.'
          )
    
          return
        }
    
        if (result?.wallet_exists) {
          setSubmitStatus(
            'This wallet is already registered.'
          )
    
          return
        }
    
        // =========================
        // INSERT
        // =========================
        const { error: insertError } = await supabase
          .from('UOL')
          .insert({
            username: twitter,
            wallet: wallet,
          })
    
        if (insertError) {
          console.error(
            'Supabase insert error:',
            insertError
          )
    
          const message =
            insertError.message?.toLowerCase() || ''
    
          if (
            message.includes(
              'x_handle_already_registered'
            )
          ) {
            setSubmitStatus(
              'This X handle is already registered.'
            )
          } else if (
            message.includes(
              'wallet_already_registered'
            )
          ) {
            setSubmitStatus(
              'This wallet is already registered.'
            )
          } else {
            setSubmitStatus(
              'Registration failed. Please try again.'
            )
          }
    
          return
        }
    
        setSubmitStatus(
          'ACCESS REGISTERED — WELCOME TO UOL.'
        )
    
        setFormData({
          twitter: '',
          wallet: '',
        })
    
      } catch (error) {
        console.error(
          'Unexpected submit error:',
          error
        )
    
        setSubmitStatus(
          'Unexpected error. Please try again.'
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <div className="uol-app">

      {/* ==================================================
          BACKGROUND
      ================================================== */}
      <div className="ambient ambient-red-one" />
      <div className="ambient ambient-red-two" />

      <div className="code-background" aria-hidden="true">
        <pre>
{`class UOLProtocol {

  constructor(identity) {
    this.identity = identity;
    this.state = "UNKNOWN";
  }

  observe() {
    return memory.capture();
  }

  rebuild(fragment) {
    return protocol.compile(fragment);
  }

  verify(hash) {
    return hash === identity.root;
  }

  preserve() {
    state.commit("ONCHAIN");
  }
}`}
        </pre>
      </div>

      {/* ==================================================
          NAVBAR
      ================================================== */}
      <header className="navbar">

        <a className="brand" href="/">
          UOL
        </a>

        <nav className="nav-center">
          <a href="">DISCORD (COMING)</a>

          <span className="nav-divider" />

          <a
            className="x-link"
            href="https://x.com/UOL_eth"
            target="_blank"
            rel="noreferrer"
          >
            <span className="x-symbol">𝕏</span>
            @UOL_eth
          </a>
        </nav>

      </header>

      {/* ==================================================
          HERO
      ================================================== */}
      <main className="hero-section">

        {/* LEFT */}
        <section className="hero-content">

          <div className="eyebrow">
          </div>

          <h1 className="hero-title">
            THE 2026
            <br />

            <span>UOL..</span>
          </h1>

          <div className="hero-description">
          </div>

          <div className="protocol-steps">

            <div className="protocol-step active-step">
              <strong>[01]</strong>
              <span>CLICK</span>
            </div>

            <span className="step-arrow">⟶</span>

            <div className="protocol-step">
              <strong>[02]</strong>
              <span>QUESTS</span>
            </div>

            <span className="step-arrow">⟶</span>

            <div className="protocol-step">
              <strong>[03]</strong>
              <span>COMPILE</span>
            </div>

          </div>

          <button
            type="button"
            className="enter-button"
            onClick={() => setShowProtocol(true)}
          >
            <span>ENTER UOL WORLD</span>
            <span className="button-arrow">⟶</span>
          </button>

          <div className="hero-meta">
            <div>
              <strong>3 quests</strong>
              <span className="meta-divider">·</span>
              <strong className="red-text">
                100% WhITELIST
              </strong>
            </div>
          </div>

        </section>

        {/* ==================================================
            RIGHT LAB PANEL
        ================================================== */}
        <section className="visual-panel" id="lab">

        <div className="slash-gallery">

          <div className="slash-card slash-card-1">
            <img src="/uol1.jpg" alt="UOL 01" />

            <div className="slash-overlay">
              <span>01</span>
              <small>UOL / WORLD</small>
            </div>
          </div>

          <div className="slash-card slash-card-2">
            <img src="/uol2.jpg" alt="UOL 02" />

            <div className="slash-overlay">
              <span>02</span>
              <small>UOL / IDENTITY</small>
            </div>
          </div>

          <div className="slash-card slash-card-3">
            <img src="/uol3.jpg" alt="UOL 03" />

            <div className="slash-overlay">
              <span>03</span>
              <small>UOL / ONCHAIN</small>
            </div>
          </div>

        </div>

        <div className="gallery-status">
          <span />
          THREE IDENTITIES DETECTED
        </div>

        <div className="gallery-code">
          <span>WORLD_01</span>
          <span>WORLD_02</span>
          <span>WORLD_03</span>
        </div>

        </section>

      </main>

      {/* ==================================================
          BOTTOM DECORATION
      ================================================== */}
      <div className="bottom-status">
        <span className="status-dot" />
        PROTOCOL ONLINE
      </div>

      {showProtocol && (
      <div
        className="protocol-modal-backdrop"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowProtocol(false)
          }
        }}
      >
        <div className="protocol-modal">

          {/* HEADER */}
          <div className="protocol-modal-header">

            <div>

              <h2>
                ENTER THE
                <br />
                <span>UOL WORLD.</span>
              </h2>
            </div>

            <button
              type="button"
              className="protocol-close"
              onClick={() => setShowProtocol(false)}
              aria-label="Close protocol"
            >
              ×
            </button>

          </div>


          {/* STATUS LINE */}
          <div className="protocol-status-line">

            <span>
              <i />
              PROTOCOL ACTIVE
            </span>

            <span>WORLD_ID: UOL_2026</span>

          </div>


          <form
            className="protocol-form"
            onSubmit={handleProtocolSubmit}
          >

            {/* ==================================================
                SOCIAL QUESTS
            ================================================== */}

            <section className="protocol-section">

              <div className="protocol-section-title">
                <span>[01]</span>
                SOCIAL PROTOCOL
              </div>


              <div className="quest-list">

                <div className="quest-row">

                  <div className="quest-number">
                    01
                  </div>

                  <div className="quest-information">
                    <strong>FOLLOW UOL ON X</strong>
                    <small>
                      Follow the official UOL account on X
                    </small>
                  </div>

                  <a
                    className="quest-action"
                    href="https://x.com/UOL_eth"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FOLLOW
                    <span>↗</span>
                  </a>

                </div>


                <div className="quest-row">

                  <div className="quest-number">
                    02
                  </div>

                  <div className="quest-information">
                    <strong>LIKE &amp; REPOST</strong>
                    <small>
                      Like and repost the official UOL post
                    </small>
                  </div>

                  <a
                    className="quest-action"
                    href="https://x.com/UOL_eth/status/2092629976361353364?s=20"
                    target="_blank"
                    rel="noreferrer"
                  >
                    REPOST
                    <span>↗</span>
                  </a>

                </div>


                <div className="quest-row">

                  <div className="quest-number">
                    03
                  </div>

                  <div className="quest-information">
                    <strong>DROP A COMMENT</strong>
                    <small>
                      Comment on the official UOL post
                    </small>
                  </div>

                  <a
                    className="quest-action"
                    href="https://x.com/UOL_eth/status/2092629976361353364?s=20"
                    target="_blank"
                    rel="noreferrer"
                  >
                    COMMENT
                    <span>↗</span>
                  </a>

                </div>
              </div>

            </section>


            {/* ==================================================
                IDENTITY
            ================================================== */}

            <section className="protocol-section identity-section">

              <div className="protocol-section-title">
                <span>[02]</span>
                IDENTITY CREDENTIALS
              </div>


              <div className="protocol-fields">

                <label className="protocol-field">
                  <span>X (TWITTER) HANDLE</span>

                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="@yourhandle"
                    autoComplete="off"
                  />
                </label>


                <label className="protocol-field">
                  <span>EVM WALLET ADDRESS</span>

                  <input
                    type="text"
                    name="wallet"
                    value={formData.wallet}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    autoComplete="off"
                  />
                </label>
              </div>

            </section>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="protocol-submit"
              disabled={isSubmitting}
            >
              <span className="submit-lock">
                ◇
              </span>

              <span>
                {isSubmitting
                  ? 'PROCESSING...'
                  : 'START PROTOCOL RUN'}
              </span>
            </button>

            {submitStatus && (
              <div className="protocol-submit-status">
                {submitStatus}
              </div>
            )}


            <div className="protocol-footer">

              <span>
                UOL / ACCESS_NODE_01
              </span>

              <span>
                CONNECTION: READY
              </span>

            </div>

          </form>


          {/* DECORATION */}

          <div className="modal-binary">
            01010101
            <br />
            01001111
            <br />
            01001100
            <br />
            00110010
            <br />
            00110000
            <br />
            00110010
            <br />
            00110110
          </div>

        </div>
      </div>
    )}

    </div>
  )
}

export default App